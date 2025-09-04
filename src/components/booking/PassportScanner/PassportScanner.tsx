import React, {useCallback, useState} from 'react';
import {Box, Button, CircularProgress, Typography} from '@mui/material';
import Tesseract from 'tesseract.js';
import {parse as parseMRZ} from 'mrz';
import {mapCountry, mapGender} from '../../../types/constants';

interface ScannedPassportData {
    firstName?: string;
    lastName?: string;
    passport?: string;
    nationality?: string;
    gender?: string;
    dateOfBirth?: Date;
    passportExpiry?: Date;
}

interface PassportScannerProps {
    onScanComplete: (data: ScannedPassportData) => void;
    disabled?: boolean;
}

const PassportScanner: React.FC<PassportScannerProps> = ({
                                                             onScanComplete,
                                                             disabled = false
                                                         }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const parseDate = useCallback((dateString: string): Date => {
        const year = parseInt(dateString.slice(0, 2), 10);
        const prefix = year < 30 ? '20' : '19';
        const fullYear = `${prefix}${dateString.slice(0, 2)}`;
        const month = dateString.slice(2, 4);
        const day = dateString.slice(4, 6);

        return new Date(`${fullYear}-${month}-${day}`);
    }, []);

    const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || disabled) return;

        setError('');
        setLoading(true);

        // Create preview URL
        const url = URL.createObjectURL(file);
        setImageUrl(url);

        try {
            // OCR Processing
            const {data} = await Tesseract.recognize(file, 'eng', {
                logger: undefined,
            });

            // Extract MRZ lines (Machine Readable Zone)
            const lines = data.text
                .split('\n')
                .map((line) => line.replace(/[^A-Z0-9<]/gi, '').trim())
                .filter((line) => line.length === 44);

            if (lines.length < 2) {
                throw new Error('Could not detect valid passport MRZ (2 lines). Try a clearer image.');
            }

            // Parse MRZ
            const mrzString = lines.slice(-2).join('\n');
            const parsedMRZ = parseMRZ(mrzString);

            if (!parsedMRZ.valid) {
                throw new Error('Failed to parse MRZ. Invalid format.');
            }

            const fields = parsedMRZ.fields as any; // Type assertion to handle library typing issues

            // Map parsed data to our format
            const scannedData: ScannedPassportData = {
                firstName: fields.givenNames?.join(' ') || '',
                lastName: fields.surnames?.[0] || '',
                passport: fields.documentNumber || '',
                nationality: mapCountry(fields.nationality || ''),
                gender: mapGender(fields.sex),
                dateOfBirth: fields.birthDate ? parseDate(fields.birthDate) : undefined,
                passportExpiry: fields.expirationDate ? parseDate(fields.expirationDate) : undefined,
            };

            // Remove empty fields
            const filteredData = Object.fromEntries(
                Object.entries(scannedData).filter(([, value]) => value !== '' && value !== undefined)
            );

            onScanComplete(filteredData);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to read passport. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
            // Clean up the URL
            if (url) URL.revokeObjectURL(url);
        }
    }, [disabled, onScanComplete, parseDate]);

    return (
        <Box sx={{mt: 2}}>
            <Typography variant="h6" gutterBottom>
                Autofill With Passport Image
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                Upload a clear photo of your passport's information page for automatic filling
            </Typography>

            <Button
                variant="outlined"
                component="label"
                disabled={disabled || loading}
                sx={{mb: 2}}
            >
                Choose File
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    hidden
                />
            </Button>

            {/* Image Preview */}
            {imageUrl && (
                <Box sx={{mt: 2}}>
                    <img
                        src={imageUrl}
                        alt="Passport preview"
                        style={{
                            maxWidth: '100%',
                            maxHeight: 200,
                            borderRadius: 4,
                            border: '1px solid #e0e0e0'
                        }}
                    />
                </Box>
            )}

            {/* Loading State */}
            {loading && (
                <Box sx={{mt: 2, display: 'flex', alignItems: 'center'}}>
                    <CircularProgress size={24} sx={{mr: 1}}/>
                    <Typography>Extracting passport information...</Typography>
                </Box>
            )}

            {/* Error State */}
            {error && (
                <Box sx={{mt: 2}}>
                    <Typography color="error">
                        ⚠️ {error}
                    </Typography>
                    <Typography variant="caption" color="error">
                        Make sure the passport image is clear and well-lit
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default PassportScanner;