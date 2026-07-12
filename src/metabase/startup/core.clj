(ns metabase.startup.core
  "Defines the `def-startup-validation!` and `def-startup-logic!` multimethods, which run when the server
  starts up: validations first (a throw aborts startup), then initialization logic."
  (:require
   [metabase.util :as u]
   [metabase.util.log :as log]))

(defmulti def-startup-validation!
  "Registers a startup precondition. All implementations run before any `def-startup-logic!`, in
  unspecified order; a throw from any of them aborts startup. Use this (not `def-startup-logic!`) for
  checks that must fail the boot before initialization logic (e.g. rejecting a removed setting), so
  nothing expensive kicks off first.

  The dispatch value can be any unique keyword and is used purely for logging.

    (defmethod startup/def-startup-validation! ::ExampleCheck [_]
      (when (misconfigured?) (throw (ex-info \"Bad config\" {}))))"
  {:arglists '([validation-name])}
  keyword)

(defmulti def-startup-logic!
  "Runs initialization logic with a given name. All implementations of this method are called once and only
  once when the server is starting up. Task namespaces (`metabase.*.task`) should add new
  implementations of this method that run the needed logic.

  The dispatch value for this function can be any unique keyword and is used purely for logging purposes.

  The function will block startup until it returns, so use `quick-task/submit-task!` if you want to run it in the background.

  For logic that should run on only one node at a time, use `cluster-lock/with-cluster-lock` in your function.

    (defmethod startup/init-logic! ::ExampleLogic [_]
      (future (println \"Running example logic...\")))"
  {:arglists '([job-name-string])}
  keyword)

(defn run-startup-logic!
  "Run all `def-startup-validation!` implementations (a throw aborts startup), then all
  `def-startup-logic!` implementations (their errors are logged and skipped). Called by metabase.core/init!"
  []
  (doseq [[k f] (methods def-startup-validation!)]
    (log/infof "Running startup validation %s" (u/format-color 'green (name k)))
    (f k))
  (doseq [[k f] (methods def-startup-logic!)]
    (try
      (log/infof "Running setup logic %s %s" (u/format-color 'green (name k)) (u/emoji "☑\uFE0F"))
      (f k)
      (catch Throwable e
        (log/errorf e "Error initializing startup logic %s" k)))))
