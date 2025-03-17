import { create } from "../api";

export const parseFilter = (text: string, returnType: boolean = false) => {
    const textremoveDSpaces = text?.trim() || "";
    const regex = /^\d+$/;
    let textFilter = textremoveDSpaces;
    const isNumber = regex.test(textFilter);
    if (isCPF(textFilter)) {
        const cleanCPF = removeCPFFormatting(textFilter);
        textFilter = cleanCPF;
    }
    try {
        if (textFilter?.length === 11) {
            return returnType
                ? {
                      type: "document",
                      filter: {
                          $or: [
                              {
                                  "clientProfileData.document": textFilter,
                              },
                              {
                                  orderGroup: textFilter,
                              },
                          ],
                      },
                  }
                : {
                      $or: [
                          {
                              "clientProfileData.document": textFilter,
                          },
                          {
                              orderGroup: textFilter,
                          },
                      ],
                  };
        } else if (isNumber) {
            return returnType
                ? {
                      type: "phone",
                      filter: {
                          "clientProfileData.phone": {
                              $regex: textFilter,
                              $options: "i",
                          },
                      },
                  }
                : {
                      "clientProfileData.phone": {
                          $regex: textFilter,
                          $options: "i",
                      },
                  };
        } else if (textFilter?.indexOf("-") === -1) {
            return returnType
                ? {
                      type: "orderGroup",
                      filter: {
                          orderGroup: textFilter,
                      },
                  }
                : { orderGroup: textFilter };
        } else {
            return returnType
                ? {
                      type: "_id",
                      filter: {
                          _id: textFilter,
                      },
                  }
                : { _id: textFilter };
        }
    } catch (error) {
        return returnType
            ? {
                  type: "_id",
                  filter: {
                      _id: textFilter,
                  },
              }
            : { _id: textFilter };
    }
};
const isCPF = (text: string): boolean => {
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return cpfRegex.test(text);
};
const removeCPFFormatting = (text: string): string => {
    return text.replace(/[.-]/g, "");
};
export const parsePackageStatus = (status: string) => {
    try {
        return capitalize(status).replace(/_/g, " ");
    } catch (error) {
        return "-";
    }
};
export function capitalize(s: string) {
    return String(s[0]).toUpperCase() + String(s).slice(1);
}

export function formatJsonField(field: string) {
    return field
        .normalize("NFD") // Remove acentos
        .replace(/[\u0300-\u036f]/g, "") // Remove os diacríticos
        .replace(/[\/\\]/g, "") // Remove barras
        .replace(/\s+/g, "_") // Substitui espaços por _
        .toLowerCase(); // Converte para minúsculas
}
interface logInterface {
<<<<<<< HEAD
    actionCallType: "function" | "create" | "update" | "delete" | "query" | "api";
    actionCallName?: string;
    actionDescription?: string;
    actionCallDataSent?: any;
=======
    actionCallType: "function" | "create" | "update" | "delete" | "query";
    actionCallName: string;
    actionDescription: string;
    actionCallDataSent: any;
>>>>>>> 3e1534e557dac41e38eda1e46a9e6361e9728ef1
}

export const saveLog = async ({ actionCallType, actionCallName, actionDescription, actionCallDataSent }: logInterface) => {
    try {
        return await create("user_log", { actionCallType, actionCallName, name: actionDescription, actionCallDataSent });
    } catch (error) {
        return false;
    }
};
