'use server'

export async function fetchProduct(search:string, filterPrice: string, filterStock: string){

    const getProducts = await fetch(`${process.env.API}/product?search=${search ?? ''}&filterPrice=${filterPrice ?? ''}&filterStock=${filterStock ?? ''}`);
    const products = await getProducts.json();

    return products;
}

export async function createPost(prevState: any, formData: FormData) {
    const name = formData.get('name')
    const price = formData.get('price')
    const stock = formData.get('stock')

    const product = {
        name: name,
        price: price,
        stock: stock
    }

    try {
        const res = await fetch(`${process.env.API}/product`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product),
        })

        const json = await res.json()

        return { message: json.message ?? 'Something error' }
    } catch (e) {
        return { message: JSON.stringify(e) ?? 'Something error' }
    }

}

export async function updateProduct(prevState: any, formData: FormData) {
    const id = formData.get('id')
    const name = formData.get('name')
    const price = formData.get('price')
    const stock = formData.get('stock')

    const product = {
        name: name,
        price: price,
        stock: stock
    }

    try {
        const res = await fetch(`${process.env.API}/product/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product),
        })

        const json = await res.json()

        return { message: json.message ?? 'Something error' }
    } catch (e) {
        return { message: JSON.stringify(e) ?? 'Something error' }
    }

}

export async function addProductToFavorite(prevState: any, product: any) {
    const editProduct = {
        ...product,
        is_favorite: !product.is_favorite
    }

    try {
        const res = await fetch(`${process.env.API}/product/${product.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editProduct),
        })

        const json = await res.json()

        return { message: json.message ?? 'Something error' }
    } catch (e) {
        return { message: JSON.stringify(e) ?? 'Something error' }
    }

}


export async function deleteProduct(prevState: any, id: number) {
    try {
        const res = await fetch(`${process.env.API}/product/${id}`, {
            method: 'DELETE'
        })
        const json = await res.json()

        return { message: json.message ?? 'Something error' }
    } catch (e) {
        return { message: JSON.stringify(e) ?? 'Something error' }
    }
}