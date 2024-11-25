export const parseFilter = (textFilter: string, returnType: boolean = false) => {
    const regex = /^\d+$/;
    const isNumber = regex.test(textFilter);
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
