import { OperationImplementationParams } from "../engine/types.js";
import { loader } from "../prompts/loader.js";
import { TaskOperationsData } from "../types.js";
import writeXlsxFile from "write-excel-file/node";

export const generateFiles = async ({
  getData,
  done,
}: OperationImplementationParams<"generate-files", TaskOperationsData>) => {
  const { exportData } = getData("export-data");
  const startLoading = async () => {
    for (const data of exportData) {
      const { id, periods } = data;
      const tableData = periods
        .reduce((acc, period) => {
          return acc.concat(period.points);
        }, [] as string[])
        .map((point) => [{ type: Number, value: Number(point) }]);
      try {
        await writeXlsxFile(tableData, {
          filePath: `${id}.xlsx`,
        });
      } catch (error) {
        console.error(error);
        done({});
      }
    }
  };

  await loader({
    startLoading,
    message: (status) => {
      if (status === "pending") {
        return exportData.length > 1
          ? "Generating files..."
          : "Generating file...";
      }
      if (status === "success") {
        return "Værsgo, Sebastian :)";
      }
      return "Failed to export data";
    },
  });
  done({});
};
