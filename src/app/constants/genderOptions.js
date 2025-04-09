export const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
];

export const mapGender = (code) => {
    const gender = code?.toUpperCase();
    if (gender === 'M') return 'male';
    if (gender === 'F') return 'female';
    return 'other';
};
