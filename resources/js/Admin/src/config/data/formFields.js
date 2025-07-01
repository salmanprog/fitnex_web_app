const application_settings = [
        {
            name: "app_name",
            label: "App Name",
            type: "input",
            className: "col-12",
        },
        {
            name: "logo",
            label: "Logo",
            type: "file",
            className: "col-12",
        },
        {
            name: "favicon",
            label: "Favicon",
            type: "file",
            className: "col-12",
        },
        {
            name: "meta_key",
            label: "Meta Key",
            type: "input",
            className: "col-12",
        },
        {
            name: "meta_description",
            label: "Meta Description",
            type: "text-area",
            className: "col-12",
        },
]

const faq = [
    {
        name: "question",
        label: "Question",
        type: "input",
        className: "col-12",
    },
    {
        name: "answer",
        label: "Answer",
        type: "text-area",
        className: "col-12",
    },
]

export const formFields = {
    application_settings,
    faq
}

export default formFields;