import {check} from 'express-validator';

export const validarCrearProyecto = [
    check('nombre')
        .notEmpty().withMessage('El nombre del proyecto es obligatorio')
        .isLength({min: 3}).withMessage('El nombre del proyecto debe tener al menos 3 caracteres'),
    check('fecha').notEmpty().withMessage('La fecha del proyecto es obligatoria').isISO8601().withMessage('La fecha debe tener un formato válido (AAAA-MM-DD)'),
    check('descripcion').optional().isLength({max: 500}).withMessage('La descripción no debe exceder los 500 caracteres'),
]