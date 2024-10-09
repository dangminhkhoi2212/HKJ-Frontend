import { TImage } from './imageType';
import { TJewelry } from './jewelryType';

export type TJewelryImage = TImage & { jewelryModel:TJewelry, isSearchImage:boolean}
export type TJewelryImageCreate = Omit<TJewelryImage, "id"|"jewelryModel">&{jewelryModel:{id:number}}
export type TJewelryImageQuery = {};
