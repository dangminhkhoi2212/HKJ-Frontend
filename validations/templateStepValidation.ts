import * as yup from 'yup';

import { KEY_CONST } from '@/const';

const templateStepSchema = yup.object({
    id: yup.number().required(KEY_CONST.REQUIRED_FIELD_MESSAGE),
    name: yup.string().required(KEY_CONST.REQUIRED_FIELD_MESSAGE),
    hkjTemplate:yup.object({
        id:yup.number().required(KEY_CONST.REQUIRED_FIELD_MESSAGE)
    })
  
});

const templateStepValidation = {
  templateStepSchema,
};
export default templateStepValidation;
