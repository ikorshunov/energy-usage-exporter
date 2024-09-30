#!/usr/bin/env node

import { createTask } from "./engine/index.js";
import { taskOperationsData, taskConfig } from "./config.js";

const task = createTask(taskOperationsData, taskConfig);
task.run();
