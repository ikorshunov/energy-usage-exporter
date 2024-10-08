#!/usr/bin/env node

import { createTask } from "./engine/index.js";
import { taskOperationsData, taskConfig } from "./config.js";

const run = createTask(taskOperationsData, taskConfig);
run();

/*
    1) Choose dates + scope (hourly + yearly)
2) Handle expired token
3) Handle API unavailable (too many request, limit exceeded)
4) Search directly by meter id
    5) Create file from results
    6) Handle ctrl+c
*/
