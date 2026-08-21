# ADR-0004 — Policy Evaluation Before Tool Execution

**Status:** Accepted

Every external tool call with a side effect passes through policy evaluation before credentials are resolved or the call is executed.
