import { Product, User } from "./database";


function getUserToken() {
    try {
        const userStorage = localStorage.getItem('baby-list-user-storage');
        if (userStorage) {
            const { state } = JSON.parse(userStorage);
            return state?.user?.token ?? null;
        }
    } catch {
        // Error parsing user storage
    }
    return null;
}


export const loginUser = async (email: string, password: string) => {
    const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    const { data } = await response.json();
    return { data };
}

export const getUserList = async () => {
    const userToken = getUserToken();
    if (!userToken) return null;
    const response = await fetch('/api/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        },
    });
    const { data } = await response.json();
    return data;
}

export const getUserByToken = async (token: string) => {
    const response = await fetch('/api/users/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
    });
    const { data } = await response.json();
    return { data };
}

export const createUser = async (formUser: Partial<User>) => {
        const userToken = getUserToken();
        if (!userToken) return null;
        const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },
                body: JSON.stringify(formUser),
            });
        return await response.json();
}

export const resetPassword = async (formUser: Partial<User>) => {
        const userToken = getUserToken();
        if (!userToken) return null;
        const response = await fetch('/api/users/token', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },
                body: JSON.stringify(formUser),
            });
        return await response.json();
}

// PRODUCTS
    
export const getProductList = async () => {
    const response = await fetch('/api/products');
    const { data } = await response.json();
    return data;
}

export const getProductAllList = async () => {
    try {
        const response = await fetch('/api/products/all');
        return await response.json();
    } catch {
        // Error fetching products
    }
};

export const updateProduct = async (id: number, product: Partial<Product>) => {
        const userToken = getUserToken();
        if (!userToken) return { data: null };
        const response = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },
                body: JSON.stringify({ product }),
            });
        const { data } = await response.json();
        return { data };
}

export const deleteProduct = async (id: number) => {
        const userToken = getUserToken();
        if (!userToken) {
            throw new Error('No authentication token found');
        }
        
        const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },
            });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
}

export const reserveProduct = async (id: number) => {
    const userToken = getUserToken();
    if (!userToken) return null;
    const response = await fetch(`/api/products/${id}/reserve`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        }
    });
    const { data } = await response.json();
    return data;
}

export const createProduct = async (product: Partial<Product>) => {
    const response = await fetch(`/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product: product }),
      });
    const { data } = await response.json();
    return { data };
}

export const parseProduct = async (productUrl: string) => {
    const response = await fetch('/api/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productUrl: productUrl }),
      });
    const { data } = await response.json();
    return data;
}



// USER MANAGEMENT

export const deactivateUser = async (userId: number) => {
    const userToken = getUserToken();
    if (!userToken) {
        throw new Error('No authentication token found');
    }

    try {
        const response = await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            },
            body: JSON.stringify({ action: 'deactivate' }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error deactivating user:', error);
        throw error;
    }
};

export const activateUser = async (userId: number) => {
    const userToken = getUserToken();
    if (!userToken) {
        throw new Error('No authentication token found');
    }

    try {
        const response = await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            },
            body: JSON.stringify({ action: 'activate' }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error activating user:', error);
        throw error;
    }
};

export const toggleUserAdmin = async (userId: number) => {
    const userToken = getUserToken();
    if (!userToken) {
        throw new Error('No authentication token found');
    }

    try {
        const response = await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            },
            body: JSON.stringify({ action: 'toggle_admin' }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error toggling user admin status:', error);
        throw error;
    }
};

export const deleteUser = async (userId: number) => {
    const userToken = getUserToken();
    if (!userToken) {
        throw new Error('No authentication token found');
    }

    try {
        const response = await fetch(`/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

// GEMINI

export const geminiGenerateText = async (mode: string) => {
    const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mode: mode }),
      });
        const { data } = await response.json();
    return data;
}

// I18N / TRANSLATIONS

export const getTranslations = async (locale: string = 'ca') => {
    const userToken = getUserToken();
    if (!userToken) {
        throw new Error('No authentication token found');
    }

    try {
        const response = await fetch(`/api/i18n?locale=${locale}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching translations:', error);
        throw error;
    }
};

export const updateTranslations = async (locale: string, translations: any) => {
    const userToken = getUserToken();
    if (!userToken) {
        throw new Error('No authentication token found');
    }

    try {
        const response = await fetch('/api/i18n', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            },
            body: JSON.stringify({ locale, translations }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating translations:', error);
        throw error;
    }
};