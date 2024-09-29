#!/usr/bin/env node

import { createTaskApi } from "./engine/index.js";
import { taskOperationsData, taskConfig } from "./config.js";

const taskApi = createTaskApi(taskOperationsData, taskConfig);
