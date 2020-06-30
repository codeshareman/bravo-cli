import { AxiosInstance } from "axios";
import { int32, int64 } from "../type";
import { AsyncReply, Page } from "../shared";

export default class ProductService {
  static readonly SERVICE_NAME = "portal-provider/product";

  constructor(private readonly http: AxiosInstance) {}

  /**
   * 分页查询商品信息
   * @param input
   */
  queryProductPage(input: ProductQuery): AsyncReply<Page<Product>> {
    return this.http
      .post(`${ProductService.SERVICE_NAME}/query`, input)
      .then(r => r.data);
  }

  /**
   * 根据ID获取商品信息
   * @param productId
   */
  findProductById(productId: int64): AsyncReply<Product> {
    return this.http
      .get(`${ProductService.SERVICE_NAME}/${productId}`)
      .then(r => r.data);
  }

  /**
   * 根据分类ID获取模版信息
   * @param categoryId
   */
  findTemplateByCategoryId(categoryId: int32): AsyncReply<Template> {
    return this.http
      .get(`${ProductService.SERVICE_NAME}/category/${categoryId}`)
      .then(r => r.data);
  }
}

export interface ProductQuery {
  pageIndex: int32;
  pageSize: int32;
  queryString?: string;
}

export interface Product {
  id: int64;
  categoryId: int32;
  name: string;
  description: string;
  coverPath: string;
  pictures: Array<string>;
  minPrice: string;
  maxPrice: string;
  price: string;
  status: ProductStatus;
  details: string;
  items: Array<ItemInfo>;
  productIntroductions: Array<ProductIntroduction>;
}

export interface ProductIntroduction {
  contentType: ContentType;
  content: string;
}

export const enum ContentType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO"
}

export interface ItemInfo {
  itemId: int64;
  itemName: string;
  unitPrice: string;
  specif: string;
  pictures: Array<string>;
  properties: Map<int64, string>;
}

export interface Template {
  specAttributes: Array<SpecAttributes>;
}

export interface SpecAttributes {
  attributeId: int64;
  attributeName: string;
}

export enum ProductStatus {
  DRAFT = 1,
  ONLINE = 2,
  OFFLINE = 3
}
