import { ControlTypeMode } from "src/app/core/enums/control-type.enums";
import { IControl } from "src/app/core/models/form-builder.interfaces";

export const controls = [
    {
        title: 'Short Text',
        arTitle: 'نص قصير',
        icon: 'assets/icons/ShortText.svg',
        control: {
            id: 1,
            name: 'txt_Delegation_user',
            type: ControlTypeMode.Text,
            validations: [],
            properties: [
                // {
                //     key: "allowComment",
                //     value: false,
                //     valueAr: '',
                //     designerProperty: true,
                //     renderProperty: true,
                //     html: false
                // },
                {
                    key: "show",
                    value: true,
                    valueAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                // {
                //     key: "showInReport",
                //     value: false,
                //     valueAr: '',
                //     designerProperty: true,
                //     renderProperty: true,
                //     html: false
                // },
                {
                    key: "hint",
                    value: '',
                    valueAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "name",
                    value: 'Short Text',
                    valueAr: 'نص قصير',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "placeholder",
                    value: 'Enter Short Text',
                    valueAr: 'ادخل النص القصير',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "value",
                    value: '',
                    text: '',
                    textAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
            ],
        },
    },
    {
        title: 'Long Text',
        arTitle: 'نص طويل',
        icon: 'assets/icons/long-text.svg',
        control: {
            id: 2,
            name: 'txt_Delegation_user',
            type: ControlTypeMode.Textarea,
            validations: [],
            properties: [
                // {
                //     key: "allowComment",
                //     value: false,
                //     valueAr: '',
                //     designerProperty: true,
                //     renderProperty: true,
                //     html: false
                // },
                {
                    key: "show",
                    value: true,
                    valueAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                // {
                //     key: "showInReport",
                //     value: false,
                //     valueAr: '',
                //     designerProperty: true,
                //     renderProperty: true,
                //     html: false
                // },
                {
                    key: "hint",
                    value: '',
                    valueAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "name",
                    value: 'Long Text',
                    valueAr: 'نص طويل',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "placeholder",
                    value: 'Enter Long Text',
                    valueAr: ' ادخل النص الطويل',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "value",
                    value: '',
                    text: '',
                    textAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
            ],
        },
    },
    {
        title: 'Number',
        arTitle: 'أرقام',
        icon: 'assets/icons/number.svg',
        control: {
            id: 3,
            name: 'txt_Delegation_user',
            type: ControlTypeMode.Number,
            validations: [],
            properties: [
                // {
                //     key: "allowComment",
                //     value: false,
                //     valueAr: '',
                //     designerProperty: true,
                //     renderProperty: true,
                //     html: false
                // },
                {
                    key: "show",
                    value: true,
                    valueAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                // {
                //     key: "showInReport",
                //     value: false,
                //     valueAr: '',
                //     designerProperty: true,
                //     renderProperty: true,
                //     html: false
                // },
                {
                    key: "hint",
                    value: '',
                    valueAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "name",
                    value: 'Number',
                    valueAr: 'أرقام',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "placeholder",
                    value: 'Enter Number',
                    valueAr: 'ادخل أرقام',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "value",
                    value: '',
                    text: '',
                    textAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
            ],

        },
    },
    {
        title: 'Users',
        arTitle: 'المستخدمين',
        icon: 'assets/icons/pepo;e-select.svg',
        control: {
            id: 5,
            name: 'txt_Delegation_user',
            type: ControlTypeMode.UserSelect,
            validations: [],
            properties: [
                // {
                //     key: "allowComment",
                //     value: false,
                //     valueAr: '',
                //     designerProperty: true,
                //     renderProperty: true,
                //     html: false
                // },
                {
                    key: "show",
                    value: true,
                    valueAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                // {
                //     key: "showInReport",
                //     value: false,
                //     valueAr: '',
                //     designerProperty: true,
                //     renderProperty: true,
                //     html: false
                // },
                {
                    key: "hint",
                    value: '',
                    valueAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "name",
                    value: 'Users',
                    valueAr: 'المستخدمين',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "placeholder",
                    value: 'Select Users',
                    valueAr: ' اختر المستخدمين',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "options",
                    values: [],
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "value",
                    value: '',
                    values: [],
                    text: '',
                    textAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    selectedValues: [],
                    html: false
                },
            ],
        },
    },
    {
        title: 'Single Select',
        arTitle: 'اختيار واحد',
        icon: 'assets/icons/select.svg',
        control: {
            id: 6,
            name: 'txt_Delegation_user',
            type: ControlTypeMode.SingleSelect,
            validations: [],
            properties: [
                // {
                //     key: "allowComment",
                //     value: false,
                //     valueAr: '',
                //     designerProperty: true,
                //     renderProperty: true,
                //     html: false
                // },
                {
                    key: "show",
                    value: true,
                    valueAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                // {
                //     key: "showInReport",
                //     value: false,
                //     valueAr: '',
                //     designerProperty: true,
                //     renderProperty: true,
                //     html: false
                // },
                {
                    key: "hint",
                    value: '',
                    valueAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "name",
                    value: 'Single Select',
                    valueAr: 'اختيار واحد',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "placeholder",
                    value: 'Select Single Value',
                    valueAr: 'اختر اختيار واحد',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "value",
                    value: '',
                    text: '',
                    textAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "options",
                    values: [],
                    designerProperty: true,
                    renderProperty: true,
                    html: false,
                    other:null
                },
                {
                    key: "api",
                    value: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "dynamicAPI",
                    value: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false,
                    diaplayProperty: '',
                    diaplayArabicProperty: '',
                    uri: '',
                    method: ''
                },
                {
                    key: "notEqual",
                    value: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                }
            ],
        },
    },
    {
        title: 'Multi Select',
        arTitle: 'تحديد متعدد',
        icon: 'assets/icons/MultiSelect.svg',
        control: {
            id: 7,
            name: 'txt_Delegation_user',
            type: ControlTypeMode.MultipleSelect,
            validations: [
                {
                    key : 'multiple'
                }
            ],
            properties: [
                // {
                //     key: "allowComment",
                //     value: false,
                //     valueAr: '',
                //     designerProperty: true,
                //     renderProperty: true,
                //     html: false
                // },
                {
                    key: "show",
                    value: true,
                    valueAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                // {
                //     key: "showInReport",
                //     value: false,
                //     valueAr: '',
                //     designerProperty: true,
                //     renderProperty: true,
                //     html: false
                // },
                {
                    key: "hint",
                    value: '',
                    valueAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "name",
                    value: 'Multi Select',
                    valueAr: 'تحديد متعدد',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "placeholder",
                    value: 'Select Multi Values',
                    valueAr: 'اختر اختيار متعدد',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "value",
                    value: '',
                    text: '',
                    textAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "options",
                    values: [],
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "api",
                    value: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "dynamicAPI",
                    value: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false,
                    diaplayProperty: '',
                    diaplayArabicProperty: '',
                    uri: '',
                    method: ''
                }
            ],
        },
    },
    {
        title: 'Date',
        arTitle: 'تاريخ',
        icon: 'assets/icons/date.svg',
        control: {
            id: 4,
            name: 'txt_Delegation_user',
            type: ControlTypeMode.Date,
            validations: [],
            properties: [
                // {
                //     key: "allowComment",
                //     value: false,
                //     valueAr: '',
                //     designerProperty: true,
                //     renderProperty: true,
                //     html: false
                // },
                {
                    key: "show",
                    value: true,
                    valueAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                // {
                //     key: "showInReport",
                //     value: false,
                //     valueAr: '',
                //     designerProperty: true,
                //     renderProperty: true,
                //     html: false
                // },
                {
                    key: "hint",
                    value: '',
                    valueAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "name",
                    value: 'Date',
                    valueAr: 'تاريخ',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "placeholder",
                    value: 'Enter Date',
                    valueAr: ' ادخل تاريخ',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "value",
                    value: '',
                    text: '',
                    textAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
            ],
        },
    },
    {
        title: 'Date Range',
        arTitle: 'رينج تاريخ',
        icon: 'assets/icons/date.svg',
        control: {
            id: 10,
            name: 'txt_Delegation_user',
            type: ControlTypeMode.DateRange,
            validations: [],
            properties: [
                // {
                //     key: "allowComment",
                //     value: false,
                //     valueAr: '',
                //     designerProperty: true,
                //     renderProperty: true,
                //     html: false
                // },
                {
                    key: "show",
                    value: true,
                    valueAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                // {
                //     key: "showInReport",
                //     value: false,
                //     valueAr: '',
                //     designerProperty: true,
                //     renderProperty: true,
                //     html: false
                // },
                {
                    key: "hint",
                    value: '',
                    valueAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "name",
                    value: 'Date Range',
                    valueAr: 'رينج تاريخ',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "value",
                    value: '',
                    text: '',
                    textAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
            ],
        },
    },
    {
        title: 'Radio Button',
        arTitle: 'زر الراديو',
        icon: 'assets/icons/SingleSelect.svg',
        control: {
            id: 8,
            name: 'txt_Delegation_user',
            enLabel: 'Radio Button',
            arLabel: 'تحديد متعدد',
            type: ControlTypeMode.RadioButton,
            validations: [],
            properties: [
                // {
                //     key: "allowComment",
                //     value: false,
                //     valueAr: '',
                //     designerProperty: true,
                //     renderProperty: true,
                //     html: false
                // },
                {
                    key: "show",
                    value: true,
                    valueAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                // {
                //     key: "showInReport",
                //     value: false,
                //     valueAr: '',
                //     designerProperty: true,
                //     renderProperty: true,
                //     html: false
                // },
                {
                    key: "hint",
                    value: '',
                    valueAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "name",
                    value: 'Radio Button',
                    valueAr: 'تحديد متعدد',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "placeholder",
                    value: 'Enter Multi Select',
                    valueAr: 'ادخل تحديد متعدد',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "value",
                    value: '',
                    text: '',
                    textAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false,
                    values: [],
                    selectedValues: []
                },
                {
                    key: "options",
                    values: [],
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
            ],
        },
    },
    {
        title: 'Checkbox',
        arTitle: 'خيارات متعدده',
        icon: 'assets/icons/MultiSelect.svg',
        control: {
            id: 11,
            name: 'txt_Delegation_user',
            enLabel: 'Checkbox',
            arLabel: 'خيارات متعدده',
            type: ControlTypeMode.Checkbox,

            properties: [
                // {
                //     key: "allowComment",
                //     value: false,
                //     valueAr: '',
                //     designerProperty: true,
                //     renderProperty: true,
                //     html: false
                // },
                {
                    key: "show",
                    value: true,
                    valueAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                // {
                //     key: "showInReport",
                //     value: false,
                //     valueAr: '',
                //     designerProperty: true,
                //     renderProperty: true,
                //     html: false
                // },
                {
                    key: "hint",
                    value: '',
                    valueAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "name",
                    value: 'Checkbox',
                    valueAr: ' خيارات متعدده',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "placeholder",
                    value: 'Enter Checkbox',
                    valueAr: 'ادخل خيارات متعدده',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "value",
                    value: '',
                    text: '',
                    textAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false,
                    values: [],
                    selectedValues: []
                },
                {
                    key: "options",
                    values: [],
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
            ],
            validations: [],
        },
    },
    {
        title: 'File Select',
        arTitle: 'اختر الملف',
        icon: 'assets/icons/file-select.svg',
        control: {
            id: 9,
            name: 'txt_Delegation_user',
            type: ControlTypeMode.File,
            validations: [],
            properties: [
                // {
                //     key: "allowComment",
                //     value: false,
                //     valueAr: '',
                //     designerProperty: true,
                //     renderProperty: true,
                //     html: false
                // },
                {
                    key: "show",
                    value: true,
                    valueAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                // {
                //     key: "showInReport",
                //     value: false,
                //     valueAr: '',
                //     designerProperty: true,
                //     renderProperty: true,
                //     html: false
                // },
                {
                    key: "hint",
                    value: '',
                    valueAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "name",
                    value: 'File Select',
                    valueAr: 'اختار الملف',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "placeholder",
                    value: 'Enter File ',
                    valueAr: 'ادخل  الملف',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "value",
                    value: '',
                    text: '',
                    textAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
            ],
        }
    },
    {
        title: 'Link',
        arTitle: 'اختر الرابط',
        icon: 'assets/icons/file-download.svg',
        control: {
            id: 9,
            name: 'txt_Delegation_user',
            type: ControlTypeMode.DownloadTemplate,
            validations: [],
            properties: [
                // {
                //     key: "allowComment",
                //     value: false,
                //     valueAr: '',
                //     designerProperty: true,
                //     renderProperty: true,
                //     html: false
                // },
                {
                    key: "show",
                    value: true,
                    valueAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                // {
                //     key: "showInReport",
                //     value: false,
                //     valueAr: '',
                //     designerProperty: true,
                //     renderProperty: true,
                //     html: false
                // },
                {
                    key: "hint",
                    value: '',
                    valueAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "title",
                    value: 'Link',
                    valueAr: 'الرابط',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "text",
                    value: 'Text',
                    valueAr: 'النص',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "name",
                    value: 'Link',
                    valueAr: 'اختار الرابط',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "value",
                    value: '',
                    text: '',
                    textAr: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                },
                {
                    key: "attachmentFiles",
                    value: '',
                    text: '',
                    textAr: '',
                    linkIcon: '',
                    linkUri: '',
                    designerProperty: true,
                    renderProperty: true,
                    html: false
                }
            ],
        }
    },
    // {
    // title: 'Repeater',
    // arTitle: 'التكرار',
    // icon: 'assets/icons/long-text.svg',
    // control: {
    //   id: 9,
    //   name: 'txt_Delegation_user',
    //   type: ControlTypeMode.repeater,
    //   validations: [],
    //   properties: [
    //     {
    //       key: "allowComment",
    //       value: false,
    //       valueAr: '',
    //       designerProperty: true,
    //       renderProperty: true,
    //       html: false
    //     },
    //     {
    //       key: "show",
    //       value: true,
    //       valueAr: '',
    //       designerProperty: true,
    //       renderProperty: true,
    //       html: false
    //     },
    //     // {
    //     //     key: "showInReport",
    //     //     value: false,
    //     //     valueAr: '',
    //     //     designerProperty: true,
    //     //     renderProperty: true,
    //     //     html: false
    //     // },
    //     {
    //       key: "hint",
    //       value: '',
    //       valueAr: '',
    //       designerProperty: true,
    //       renderProperty: true,
    //       html: false
    //     },
    //     {
    //       key: "name",
    //       value: 'Repeater',
    //       valueAr: 'التكرار',
    //       designerProperty: true,
    //       renderProperty: true,
    //       html: false
    //     },
    //     {
    //       key: "text",
    //       value: 'Enter Text ',
    //       valueAr: 'ادخل  النص',
    //       designerProperty: true,
    //       renderProperty: true,
    //       html: false
    //     },
    //     {
    //       key: "title",
    //       value: 'Enter Title',
    //       valueAr: 'ادخل العنوان',
    //       designerProperty: true,
    //       renderProperty: true,
    //       html: false
    //     },
    //     {
    //       key: "value",
    //       value: '',
    //       text: '',
    //       textAr: '',
    //       designerProperty: true,
    //       renderProperty: true,
    //       html: false
    //     },
    //   ],
    // }
    // },
    // {
    //     title: 'New Step',
    //     arTitle: 'خطوه جديده',
    //     icon: 'assets/icons/new-step.svg',
    //     control: {
    //         id: 12,
    //         name: 'txt_Delegation_user',
    //         enLabel: 'New Step',
    //         arLabel: 'خطوه جديده',
    //         type: ControlTypeMode.newStep,
    //     },
    // },
];
