export const parseFilter = (textFilter: string) => {
    const regex = /^\d+$/;
    const isNumber = regex.test(textFilter);
    try {
        if (textFilter?.length === 11) {
            return {
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
            return {
                "clientProfileData.phone": {
                    $regex: textFilter,
                    $options: "i",
                },
            };
        } else if (textFilter?.indexOf("-") === -1) {
            return {
                orderGroup: textFilter,
            };
        } else {
            return {
                _id: textFilter,
            };
        }
    } catch (error) {
        return {
            _id: textFilter,
        };
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
