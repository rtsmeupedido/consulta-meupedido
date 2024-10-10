import axios from "axios";

const url = localStorage.getItem("@uri-tck-meupedido-zendesk") || undefined;

export const api = axios.create({
    baseURL: url,
});

// --------------- BEST ACTIONS ------------------
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

// --------------- BEST ACTIONS FUNC------------------

export default api;
