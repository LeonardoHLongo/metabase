(ns metabase.startup.core
  "Defines the `def-startup-validation!` and `def-startup-logic!` multimethods, which run when the server
  starts up: validations first (a throw aborts startup), then initialization logic."
  (:require
   [metabase.util :as u]
   [metabase.util.log :as log]))

(defmulti def-startup-validation!
  "Registers a startup precondition: all run before any `def-startup-logic!`, and a throw from one aborts startup.
  Order among validations is unspecified.
  Use this over `def-startup-logic!` for checks that must fail the boot before initialization logic runs.
  The dispatch value is any unique keyword, used only for logging.

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

(defn- run-startup-impls!
  "Run each `[dispatch-value f]` pair in `impls`, logging each under `phase`.
  With `abort-on-error?` a throw propagates; otherwise it is logged and the remaining pairs still run."
  [phase impls abort-on-error?]
  (doseq [[k f] impls]
    (log/infof "Running %s %s %s" phase (u/format-color 'green (name k)) (u/emoji "☑️"))
    (if abort-on-error?
      (f k)
      (try
        (f k)
        (catch Throwable e
          (log/errorf e "Error initializing startup logic %s" k))))))

(defn run-startup-logic!
  "Run all `def-startup-validation!` implementations (a throw aborts startup), then all `def-startup-logic!`
  implementations (errors logged and skipped). Called by metabase.core/init!"
  []
  (run-startup-impls! "startup validation" (methods def-startup-validation!) true)
  (run-startup-impls! "startup logic"      (methods def-startup-logic!)      false))
