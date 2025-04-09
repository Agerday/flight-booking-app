import React, {useState} from 'react';
import Tesseract from 'tesseract.js';
import {parse as parseMRZ} from 'mrz';
import {Box, CircularProgress, Typography} from '@mui/material';
import {mapCountry} from '../../app/constants/countryMap';
import {mapGender} from "../../app/constants/genderOptions";

const PassportScanner = ({onScanComplete}) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError('');
        setLoading(true);
        setImageUrl(URL.createObjectURL(file));

        try {
            const {data} = await Tesseract.recognize(file, 'eng', {
                logger: (msg) => console.log('[OCR]', msg),
            });

            const lines = data.text
                .split('\n')
                .map((line) => line.replace(/[^A-Z0-9<]/gi, '').trim())
                .filter((line) => line.length === 44);

            if (lines.length < 2) {
                throw new Error('Could not detect valid passport MRZ (2 lines). Try a clearer image.');
            }

            const mrz = lines.slice(-2).join('\n');
            const result = parseMRZ(mrz);

            if (!result.valid) {
                throw new Error('Failed to parse MRZ. Invalid format.');
            }

            const {fields} = result;

            const parseDate = (raw) => {
                const year = parseInt(raw.slice(0, 2), 10);
                const prefix = year < 30 ? '20' : '19';
                return new Date(`${prefix}${raw.slice(0, 2)}-${raw.slice(2, 4)}-${raw.slice(4, 6)}`);
            };

            const mapped = {
                firstName: fields.givenNames?.join(' ') || '',
                lastName: fields.surnames?.[0] || '',
                passport: fields.documentNumber,
                nationality: mapCountry(fields.nationality),
                gender: mapGender(fields.sex),
                dateOfBirth: parseDate(fields.birthDate),
                passportExpiry: parseDate(fields.expirationDate),
            };
            console.log(mapped)

            onScanComplete(mapped);
        } catch (err) {
            console.error('[Scanner Error]', err);
            setError(err.message || 'Failed to read passport. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box mt={4}>
            <Typography variant="h6">Autofill With Passport Image</Typography>
            <input type="file" accept="image/*" onChange={handleFileChange}/>

            {imageUrl && (
                <Box mt={2}>
                    <img
                        src={imageUrl}
                        alt="Passport preview"
                        style={{maxWidth: '100%', maxHeight: 200, borderRadius: 4}}
                    />
                </Box>
            )}

            {loading && (
                <Box mt={2} display="flex" alignItems="center">
                    <CircularProgress size={24} sx={{mr: 1}}/>
                    <Typography>Extracting info...</Typography>
                </Box>
            )}

            {error && (
                <Typography mt={2} color="error">
                    ❌ {error}
                </Typography>
            )}
        </Box>
    );
};

export default PassportScanner;
