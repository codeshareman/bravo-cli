class Price {
  /**
   * @description 获取过滤后的价格列表数据
   * @param  priceList 价格列表数据
   * @memberof Price
   */
  public getFilteredPriceList = (priceList: Array<any>) => {
    return priceList.map((rows: any) => {
      return {
        ...rows,
        id: rows.productId ? rows.productId : rows.itemId,
        items: rows.items && rows.items.length > 0 ? this.getFilteredPriceList(rows.items) : [],
      };
    });
  };

  /**
   * @description  根据sku_id获取spu信息
   * @param skuId  sku_id
   * @param dataSource  原始数据源
   * @memberof Price
   */
  public getSpuBasedOnSkuId = (dataSource, skuId: number) => {
    let spuInfo = null;
    dataSource.forEach((spu, index) => {
      const skuList = spu.items;
      skuList.forEach((sku, index) => {
        if (sku.id === skuId) {
          spuInfo = spu;
        }
      });
    });
    return spuInfo;
  };

  /**
   * @description  获取改变后的数据源
   * @param spuId  spu_id
   * @param dataSource  原始数据源
   * @param newData  改变后的spu数据
   * @memberof Price
   */
  public getChangedDataSource = (spuId: number, dataSource: Array<any>, newData: any) => {
    return dataSource.map((item: any, index) => {
      let dataItem = item;
      if (item.id === spuId) {
        dataItem = newData;
      }
      return dataItem;
    });
  };

  // public getChangedDataSource = (values: number, dataSource: Array<any>, newData: any) => {
  //   return dataSource.map((item: any, index) => {
  //     let dataItem = item;
  //     if (item.id === spuId) {
  //       dataItem = newData;
  //     }
  //     return dataItem;
  //   });
  // };
}

export default new Price();
