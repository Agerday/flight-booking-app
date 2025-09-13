import React, { useCallback, useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import Tesseract from 'tesseract.js';

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
            const { data } = await Tesseract.recognize(file, 'eng');

            const text = data.text.toUpperCase();
            console.log('OCR Result:', text);

            // Simple extraction based on common passport patterns
            const scannedData: ScannedPassportData = {};

            // Try to find surname/last name
            const surnameMatch = text.match(/(?:SURNAME|LAST\s*NAME|NOM|APELLIDOS?)[:\s]*([A-Z]+(?:\s+[A-Z]+)*)/);
            if (surnameMatch) scannedData.lastName = surnameMatch[1].trim();

            // Try to find given names/first name
            const givenNameMatch = text.match(/(?:GIVEN\s*NAMES?|FIRST\s*NAME|PRENOM|NOMBRES?)[:\s]*([A-Z]+(?:\s+[A-Z]+)*)/);
            if (givenNameMatch) scannedData.firstName = givenNameMatch[1].trim();

            // Try to find passport number
            const passportMatch = text.match(/(?:PASSPORT|NUMBER|NO|PASSEPORT)[:\s]*([A-Z0-9]{6,9})/);
            if (passportMatch) scannedData.passport = passportMatch[1].trim();

            // Try to find nationality
            const nationalityMatch = text.match(/(?:NATIONALITY|NATIONALITE|NACIONALIDAD)[:\s]*([A-Z]+(?:\s+[A-Z]+)*)/);
            if (nationalityMatch) scannedData.nationality = nationalityMatch[1].trim();

            // Try to find gender/sex
            const genderMatch = text.match(/(?:SEX|GENDER|SEXE|SEXO)[:\s]*([MF])/);
            if (genderMatch) {
                scannedData.gender = genderMatch[1] === 'M' ? 'male' : 'female';
            }

            // Try to find date of birth (various formats)
            const dobMatch = text.match(/(?:DATE\s*OF\s*BIRTH|BIRTH|NE\s*LE|FECHA\s*DE\s*NACIMIENTO)[:\s]*(\d{1,2}[\s\/\-]\w{3,9}[\s\/\-]\d{2,4})/);
            if (dobMatch) {
                try {
                    scannedData.dateOfBirth = new Date(dobMatch[1].replace(/\s+/g, ' '));
                } catch (e) {
                    console.warn('Could not parse date of birth:', dobMatch[1]);
                }
            }

            // Try to find expiry date
            const expiryMatch = text.match(/(?:EXPIRY|EXPIRATION|EXPIRE|FECHA\s*DE\s*EXPIRACION)[:\s]*(\d{1,2}[\s\/\-]\w{3,9}[\s\/\-]\d{2,4})/);
            if (expiryMatch) {
                try {
                    scannedData.passportExpiry = new Date(expiryMatch[1].replace(/\s+/g, ' '));
                } catch (e) {
                    console.warn('Could not parse expiry date:', expiryMatch[1]);
                }
            }

            // Remove undefined values
            const filteredData = Object.fromEntries(
                Object.entries(scannedData).filter(([_, value]) => value !== undefined)
            );

            if (Object.keys(filteredData).length === 0) {
                throw new Error('Could not extract any information. Please ensure the image is clear and try again.');
            }

            console.log('Extracted data:', filteredData);
            onScanComplete(filteredData);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to read passport. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
            if (url) URL.revokeObjectURL(url);
        }
    }, [disabled, onScanComplete]);

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
                Autofill With Passport Image
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Upload a clear photo of your passport's information page for automatic filling
            </Typography>

            <Button
                variant="outlined"
                component="label"
                disabled={disabled || loading}
                sx={{ mb: 2 }}
            >
                Choose File
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    hidden
                />
            </Button>

            {imageUrl && (
                <Box sx={{ mt: 2 }}>
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

            {loading && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    <Typography>Extracting passport information...</Typography>
                </Box>
            )}

            {error && (
                <Box sx={{ mt: 2 }}>
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