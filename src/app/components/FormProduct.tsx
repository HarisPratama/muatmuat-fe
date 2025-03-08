'use client'

import React, {useActionState, useState, useEffect} from "react";
import {createPost, updateProduct} from "@/app/lib/action";
import { TextField, Button, Alert } from '@mui/material';
import {useRouter} from "next/navigation";

import CheckIcon from '@mui/icons-material/Check';

const initialState = {
    message: '',
}

export default function FormProduct({product}: {product: any}) {
    const [state, formAction, pending] = useActionState(product?.id ? updateProduct : createPost, initialState);
    const [form, setForm] = useState({
        id: 0,
        name: '',
        price: 0,
        stock: 0,
    })
    const { refresh } = useRouter()
    const handleChangeNumber = (value: number) => {

    }

    useEffect(() => {
        if (product?.id) {
            setForm(product)
        }
    }, [])
    useEffect(() => {
        if(state.message.length > 0) refresh()
    }, [state]);

    const onChangeValue = (e:any) => {
        const {name, value} = e.target
        setForm({...form, [name]: value})
    }

    return (
        <div>
            {state.message && <Alert icon={<CheckIcon fontSize="inherit"/>} severity="success">
                {state.message}.
            </Alert>}
            <h1>{product?.id ? 'Edit' : 'Add'} Product</h1>
            <form action={formAction} className="text-white flex flex-col gap-3 mt-3">
                {product?.id && <input className="hidden" name="id" readOnly={true} value={product.id} />}
                <TextField
                    id="name"
                    label="Product Name"
                    name="name"
                    className="bg-gray-50 rounded-md shadow-sm"
                    value={form?.name || ''}
                    onChange={onChangeValue}
                    required
                />
                <TextField
                    id="price"
                    label="Price"
                    name="price"
                    className="bg-gray-50 rounded-md shadow-sm"
                    type="number"
                    value={form?.price || ''}
                    onChange={onChangeValue}
                    required
                />
                <TextField
                    id="stock"
                    label="Stock"
                    name="stock"
                    className="bg-gray-50 rounded-md shadow-sm"
                    type="number"
                    value={form?.stock || ''}
                    onChange={onChangeValue}
                    required
                />
                <Button type="submit" disabled={pending}>Submit</Button>
            </form>
        </div>

    )
};
