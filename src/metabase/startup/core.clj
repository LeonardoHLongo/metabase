(ns metabase.startup.core
  "Defines the `def-startup-logic!` multimethod, which is used to run initialization logic when the server starts up."
  (:require
   [metabase.util :as u]
   [metabase.util.log :as log]))

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

(defn fatal-ex-info
  "Build an ex-info that [[run-startup-logic!]] rethrows to abort startup, instead of logging and continuing."
  [message data]
  (ex-info message (assoc data ::fatal true)))

(defn run-startup-logic!
  "Call all implementations of `def-startup-logic!`. Called by metabase.core/init!
  Errors are logged and skipped unless flagged fatal via [[fatal-ex-info]], which aborts startup."
  []
  (doseq [[k f] (methods def-startup-logic!)]
    (try
      (log/infof "Running setup logic %s %s" (u/format-color 'green (name k)) (u/emoji "☑\uFE0F"))
      (f k)
      (catch Throwable e
        (when (::fatal (ex-data e))
          (throw e))
        (log/errorf e "Error initializing startup logic %s" k)))))
