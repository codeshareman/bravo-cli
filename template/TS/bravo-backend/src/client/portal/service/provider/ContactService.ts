import axios, { AxiosInstance } from 'axios'
import { AsyncReply } from '../../../shared/shared'
import { int64, int32, float64 } from '../../../shared/type'

export default class ContactService {
    static readonly SERVICE_NAME = 'contact'

    constructor(private readonly http: AxiosInstance) {}

    /**
     * 查询所有省
     */
    provinces(): AsyncReply<UserContactViewDto> {
        return this.http
            .get(`/${ContactService.SERVICE_NAME}/provinces`)
            .then(r => r.data)
    }

    /**
     * 根据省code查询所有城市
     */
    findCitiesByProvinceCode(provinceCode: String): AsyncReply<City[]> {
        return this.http
            .get(`/${ContactService.SERVICE_NAME}/cities/${provinceCode}`)
            .then(r => r.data)
    }

    /**
     * 根据cityCode查询地区
     */
    findAreasByCityCode(cityCode: String): AsyncReply<Area[]> {
        return this.http
            .get(`/${ContactService.SERVICE_NAME}/areas/${cityCode}`)
            .then(r => r.data)
    }

    /**
     * 根据areaCode查询完整区域信息
     */
    findCompleteDistrictByAreaCode(areaCode: String): AsyncReply<Area[]> {
        return this.http
            .get(`/${ContactService.SERVICE_NAME}/area/${areaCode}`)
            .then(r => r.data)
    }

    /**
     * 查询用户所有的收货地址信息
     */
    all(): AsyncReply<UserContactViewDto> {
        return this.http
            .post(`/${ContactService.SERVICE_NAME}/all`)
            .then(r => r.data)
    }

    /**
     * 新增收货地址
     */
    add(request: SaveUserContactRequest): AsyncReply<int64> {
        return this.http
            .post(`/${ContactService.SERVICE_NAME}/add`, request)
            .then(r => r.data)
    }

    /**
     * 更新收货地址
     */
    update(request: SaveUserContactRequest): AsyncReply<int64> {
        return this.http
            .post(`/${ContactService.SERVICE_NAME}/update`, request)
            .then(r => r.data)
    }

    /**
     * 移除收货地址
     */
    remove(userContactId: int64): AsyncReply<any> {
        return this.http
            .post(`/${ContactService.SERVICE_NAME}/del/${userContactId}`)
            .then(r => r.data)
    }

    /**
     * 设置默认地址
     * @param usrContactId 
     */
    setDefault(usrContactId: int64): AsyncReply<Boolean> {
        return this.http
            .post(`/${ContactService.SERVICE_NAME}/default`, usrContactId)
            .then(r => r.data)
    }

    /**
     * 获取默认收货地址
     */
    getDefault(): AsyncReply<UserContactViewDto> {
        return this.http
            .get(`/${ContactService.SERVICE_NAME}/default`)
            .then(r => r.data)
    }
}

export interface UserContactViewDto {
    // 地址
    addressLine: String
    // 地
    area: String
    // 市
    city: String
    // 联系人
    contactName: String
    // 联系电话
    contactPhone: String
    // 创建时间
    createTime: int64
    // 是否市默认地址
    defaultAddress: Boolean
    // 邮箱
    email: String
    // 最后更新时间
    lastUpdateTime: int64
    // 邮编
    postCode: String
    // 省
    province: String
    // uid
    userId: int64
    // 收货地址id
    usrContactId: int64
}

export interface SaveUserContactRequest {
    // 地址
    addressLine: String
    // 区域代码
    areaCode: String
    // 联系人
    contactName: String
    // 联系电话
    contactPhone: String
    // 是否是默认地址
    defaultAddress: Boolean
    // 邮箱
    email: String
    // 邮政编码
    postCode: String
    // uid
    // userId: int64
    // 收货地址id
    usrContactId: int64
}

export interface Province {
    code: String,
    name: String
}

export interface City {
    code: String,
    name: String,
    provinceCode: String
}

export interface Area {
    code: String,
    name: String,
    cityCode: String
}

export interface CompleteDistrict {
    areaCode: String,
    areaName: String,
    cityCode: String,
    cityName: String,
    provinceCode: String,
    provinceName: String
}