export interface Issuer { // TODO: ensure name doesn't conflict
  id: string;
  name?: string;
  styles?: Styles | string;
}
export interface Styles {
  thumbnail?: ImageObject;
  hero?: ImageObject;
  background?: ColorObject;
  text?: ColorObject;
}
export interface ImageObject {
  uri: string;
  alt: string;
}
export interface ColorObject {
  color: string;
}
export interface DisplayMapping {
}
