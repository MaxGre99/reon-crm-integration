import { AmoCustomFieldTypes } from '../../modules/amo/amo.consts';

export const ContactCustomFieldNames = {
    Birthday: 'Дата рождения',
    Age: 'Возраст',
    FaceLaserRejuvenation: 'Лазерное омоложение лица',
    UltrasonicLifting: 'Ультразвуковой лифтинг',
    VascularLaserRemoval: 'Лазерное удаление сосудов',
    MimicWrinkleCorrection: 'Коррекция мимических морщин',
    LaserEpilation: 'Лазерная эпиляция',
} as const;

export const DealCustomFieldNames = {
    Services: 'Услуги',
} as const;

export const REQUIRED_CONTACT_CUSTOM_FIELDS = [
    { name: ContactCustomFieldNames.Birthday, type: AmoCustomFieldTypes.Date },
    { name: ContactCustomFieldNames.Age, type: AmoCustomFieldTypes.Numeric },
    { name: ContactCustomFieldNames.FaceLaserRejuvenation, type: AmoCustomFieldTypes.Numeric },
    { name: ContactCustomFieldNames.UltrasonicLifting, type: AmoCustomFieldTypes.Numeric },
    { name: ContactCustomFieldNames.VascularLaserRemoval, type: AmoCustomFieldTypes.Numeric },
    { name: ContactCustomFieldNames.MimicWrinkleCorrection, type: AmoCustomFieldTypes.Numeric },
    { name: ContactCustomFieldNames.LaserEpilation, type: AmoCustomFieldTypes.Numeric },
];

export const REQUIRED_DEAL_CUSTOM_FIELDS = [{ name: DealCustomFieldNames.Services, type: AmoCustomFieldTypes.Multiselect }];

export const REQUIRED_SERVICE_ENUM_VALUES = [
    ContactCustomFieldNames.FaceLaserRejuvenation,
    ContactCustomFieldNames.UltrasonicLifting,
    ContactCustomFieldNames.VascularLaserRemoval,
    ContactCustomFieldNames.MimicWrinkleCorrection,
    ContactCustomFieldNames.LaserEpilation,
];
