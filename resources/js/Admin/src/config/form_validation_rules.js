const register = {
  name: [
    { required: true, message: "Name is required!" },
    { min: 3, message: "Name must be more than 2 characters" },
    { max: 20, message: "Name must not be more than 20 characters" },
  ],
  field: [
    { required: true, message: "Field is required!" },
    { min: 3, message: "Field must be more than 3 characters" },
  ],
  title: [
    { required: true, message: "Title is required!" },
    { min: 3, message: "Title must be more than 3 characters" },
  ],
  only_number: [
    { required: true, message: "Price is required" },
    { pattern: "[0-9]", message: "Please enter a number!" },
  ],
  quantity: [
    { required: true, message: "Quantity is required" },
    { pattern: "[0-9]", message: "Please enter a number!" },
  ],
  description: [
    { required: true, message: "Description is required!" },
  ],
  selectdate: [
    { required: true, message: "Date is required!" },
  ],
  selecttime: [
    { required: true, message: "Time is required!" },
  ],
  dob: [
    { required: true, message: "Date of birth is required!" }
  ],
  email: [
    { required: true, message: "Email is required!" },
    { type: "email", message: "Enter a valid Email address" },
  ],
  phone: [
    {
      required: true,
      message: "Phone Number is required!",
    },
    {
      pattern:
        "([2-9]|[1-9][0-9]{1,8}|1[0-9]{9}|20[01][0-9]{7}|202[0-4][0-9]{6}|2025[0-4][0-9]{5}|20255[0-4][0-9]{4}|2025550[0-9]{3}|2025551[01][0-9]{2}|202555120[0-9]|202555121[0-8])",
      message: "Please enter a valid phone number (1-2025551218) ",
    },
  ],
  country: [
    { required: true, message: "Country is required!" },
    { min: 1, max: 20, message: "Country must be between 1 and 20" },
  ],
  city: [
    { required: true, message: "City is required!" },
    { min: 1, max: 20, message: "City must be between 1 and 20" },
  ],
  business_name: [
    { required: true, message: "Business Name is required!" },
    { min: 1, max: 20, message: "Business Name must be between 1 and 20" },
  ],
  zipcode: [
    { required: true, message: "Zip Code is required!" },
    { pattern: "[0-9]", message: "Enter valid Zip code (numeric digits)" },
    { max: 5, message: "Length of Zip Code must be 5 digits" },
  ],
  password: [
    { required: true, message: "Password is required!" },
    {
      min: 8,
      message: "Password must be at least 8 characters long",
    },
    {
      pattern: /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,150}$/,
      message:
        "Password should contain at least one uppercase letter, one lowercase letter, one number and one special character",
    },
  ],
  confirmpassword: [
    { required: true, message: "Confirm Password is required!" },
    {
      min: 8,
      message: "Password must be at least 8 characters long",
    },
    {
      pattern: /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,150}$/,
      message:
        "Password should contain at least one uppercase letter, one lowercase letter, one number and one special character",
    },
  ],
  ein_number: [
    { required: true, message: "EIN Number is required!" },
    { pattern: "[0-9]", message: "Please enter a number!" },
  ],
  category_ids: [{ required: true, message: "Category is required!" }],
  ssn_front_image: [
    { required: true, message: "SSN Front Image is required!" },
  ],
  ssn_back_image: [{ required: true, message: "SSN Back Image is required!" }],
  driving_license_front: [
    { required: true, message: "Driving License Front Image is required!" },
  ],
  driving_license_back: [
    { required: true, message: "Driving License Back Image is required!" },
  ],
};
export { register };
