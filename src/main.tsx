#!/usr/bin/env node

import { createTask } from "./engine/index.js";
import { taskOperationsData, taskConfig } from "./config.js";

const run = createTask(taskOperationsData, taskConfig);
run();
