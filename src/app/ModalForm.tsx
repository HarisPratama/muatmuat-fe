import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import {createPost} from "@/app/lib/action";
import FormProduct from "@/app/components/FormProduct";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 400,
    bgcolor: 'black',
    border: '2px solid #fff',
    boxShadow: 24,
    p: 4,
};

export default function ModalForm({open, handleClose, product}: {open: boolean, handleClose: () => void, product:any}) {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <FormProduct product={product} />
            </Box>
        </Modal>
    )
}