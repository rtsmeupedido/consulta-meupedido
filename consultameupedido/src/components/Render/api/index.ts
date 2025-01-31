import axios from "axios";
const url = localStorage.getItem("@uri-tck-meupedido-zendesk") || undefined;
export const api = axios.create({
    baseURL: url,
});

export const show = (datasource: string, data: any, type: string = "table"): any => {
    return new Promise((resolve) => {
        api.get(`/api/${datasource}/${Object.values(data)[0]}?field=${Object.keys(data)[0]}&$type=${type}`, {
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                resolve(error?.response?.data);
            });
    });
};
export const list = (datasource?: string, data?: any, pagination?: any, type: string = "table", sort: any = null, getPagination: boolean = false, select: any[] = []): Promise<any> => {
    return new Promise((resolve) => {
        const requestData = {
            ...data,
            pagination: {
                ...pagination,
                size: pagination?.size || pagination?.pageSize,
                pageSize: pagination?.size || pagination?.pageSize,
            },
            sort,
            getPagination,
            type,
            select,
        };

        api.post(`/api/${datasource}/filter?$type=${type}`, requestData, {
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                resolve(response.data);
                // addSystemLog();
            })
            .catch((error) => {
                resolve(error?.response?.data);
            });
    });
};
export const update = (datasource?: string, data?: any, form: string | null = null, idField: string = "_id"): Promise<any> => {
    return new Promise((resolve) => {
        let url = `/api/${datasource}/${data?.[idField]}?field=${idField}`;
        if (form) {
            url += `&form=${form}`;
        }

        api.put(url, data, {
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                resolve(error?.response?.data);
            });
    });
};
export const remove = (datasource?: string, id?: string | number): Promise<any> => {
    return new Promise((resolve) => {
        const url = `/api/${datasource}/${id}/?field=_id`;
        api.delete(url, {
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                resolve(error?.response?.data);
            });
    });
};
export const create = (datasource?: string, data?: any, form: string | null = null): Promise<any> => {
    return new Promise((resolve) => {
        let url = `/api/${datasource}`;
        if (form) {
            url += `?form=${form}`;
        }

        api.post(url, data, {
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                resolve(error?.response?.data);
            });
    });
};

export const execFunc = (keyname?: string, data?: any, axiosController?: any): Promise<any> => {
    return new Promise((resolve) => {
        const url = `/api/func/${keyname}?is_server=false`;
        api.post(url, data, {
            headers: {
                "Content-Type": "application/json",
                is_server: "false",
            },
            signal: axiosController,
        })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                resolve(error?.response?.data);
            });
    });
};
export const addSystemLog = (data?: { datasource: string; user: string | number }): Promise<any> => {
    return new Promise((resolve) => {
        create("user_activities", data).then((data) => {
            resolve(data);
        });
    });
};
export const downloadNf = (url: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
export const checkAuth = (token: string) => {
    return new Promise((resolve, reject) => {
        const url = "/auth/check";
        api.get(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                if (response?.data?._id) {
                    resolve(true);
                } else {
                    reject(false);
                }
            })
            .catch(() => {
                reject(false);
            });
    });
};
export default api;
