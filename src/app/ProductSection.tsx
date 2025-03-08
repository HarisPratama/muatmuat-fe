'use client'

import React, {useState, useMemo, useEffect, useActionState} from "react";
import ModalForm from "@/app/ModalForm";
import {
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Alert, Backdrop, CircularProgress
} from '@mui/material';
import * as _ from "lodash"
import {usePathname, useSearchParams, useRouter} from "next/navigation";
import { useDebouncedCallback } from 'use-debounce';
import {addProductToFavorite, deleteProduct} from "@/app/lib/action";
import CheckIcon from "@mui/icons-material/Check";

const initialState = {
    message: '',
}

export default function ProductSection({products}: {products: any}) {
    const [state, deleteAction, pending] = useActionState(deleteProduct, initialState);
    const [state2, addFavoriteAction, pendingAdd] = useActionState(addProductToFavorite, initialState);

    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [productId, setProductId] = useState(0);
    const [product, setProduct] = useState({});
    const [prices, setPrices] = useState({
        min: '',
        max: '',
    });
    const [stock, setStock] = useState({
        min: '',
        max: '',
    });
    const searchParams = useSearchParams()
    const pathname = usePathname();
    const { replace } = useRouter();

    useEffect(() => {
        return () => {
            debouncedResults.cancel();
        };
    }, [])

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleOpenDialog = (id:any) => {
        setProductId(id);
        setOpenDialog(true)
    };
    const handleCloseDialog = () => setOpenDialog(false);
    const editProduct = (product: any) => () => {
        setProduct(product);
        setOpen(true)
    }

    const onSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('search', term);
        } else {
            params.delete('search');
        }
        replace(`${pathname}?${params.toString()}`);
    }

    const debouncedResults = useMemo(() => {
        return _.debounce(onSearch, 300);
    }, []);

    const onChangePrices = useDebouncedCallback((e: any) => {
        const {value, name} = e.target;
        setPrices({
            ...prices,
            [name]: String(value),
        })

        const params = new URLSearchParams(searchParams);
        if (prices.min.length > 0 || prices.max.length > 0) {
            params.set('filterPrice', `${prices.min},${prices.max}`);
        } else {
            params.delete('filterPrice');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300)

    const onChangeStock = useDebouncedCallback((e: any) => {
        const {value, name} = e.target;
        setStock({
            ...stock,
            [name]: String(value),
        })

        const params = new URLSearchParams(searchParams);
        if (stock.min.length > 0 || stock.max.length > 0) {
            params.set('filterStock', `${stock.min},${stock.max}`);
        } else {
            params.delete('filterStock');
        }
        replace(`${pathname}?${params.toString()}`);
    })

    return (
        <div>
            {state.message && <Alert icon={<CheckIcon fontSize="inherit"/>} severity="success">
                {state.message}.
            </Alert>}
            <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                    <div className="flex gap-3 items-center w-full">
                        <h1>Muatmuat</h1>

                        <TextField
                            className="bg-gray-50 rounded-md shadow-sm"
                            onChange={debouncedResults} id="search" label="Search" variant="outlined" />
                    </div>
                    <div className="flex mt-7 gap-3 items-center w-full">
                        Filter by Price:
                        <br/>
                        <TextField
                        className="bg-gray-50 rounded-md shadow-sm" type="number"
                        onChange={onChangePrices} id="min" name="min" label="Min" variant="outlined" />
                        To: <TextField
                        className="bg-gray-50 rounded-md shadow-sm"
                        onChange={onChangePrices} id="max" name="max" type="number" label="Max" variant="outlined" />
                    </div><div className="flex mt-7 gap-3 items-center w-full">
                        Filter by Stock:
                        <br/>
                        <TextField
                        className="bg-gray-50 rounded-md shadow-sm" type="number"
                        onChange={onChangeStock} id="min" name="min" label="Min" variant="outlined" />
                        To: <TextField
                        className="bg-gray-50 rounded-md shadow-sm"
                        onChange={onChangeStock} id="max" name="max" type="number" label="Max" variant="outlined" />
                    </div>
                </div>
                <div>
                    <Button onClick={handleOpen} variant="outlined">Add Product</Button>
                </div>
            </div>
            <div className="mt-7 flex flex-wrap justify-between">
                {products.data.map((product:any) => (
                    <div key={product.id} className="h-56 mt-5 w-72 border-b border-b-gray-50">
                        <h1>{product.name}</h1>
                        <h3>{product.price}</h3>
                        <h3>{product.stock}</h3>
                        <div className="flex gap-3">
                            <Button onClick={editProduct(product)} variant="outlined">Edit</Button>
                            <Button onClick={() => {handleOpenDialog(product.id)}} variant="outlined">Delete</Button>
                            <Button onClick={async () =>  addFavoriteAction(product)} variant={product.is_favorite ? "contained" :"outlined"}>Add To Favorite</Button>
                        </div>
                    </div>
                ))}
            </div>
            
            <ModalForm open={open} handleClose={handleClose} product={product} />

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirmation"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure want to delete product?.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>No</Button>
                    <Button disabled={pending} onClick={async () => {
                        handleCloseDialog()
                        return deleteAction(productId)
                    }} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={pending || pendingAdd}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>    
    )
    
}