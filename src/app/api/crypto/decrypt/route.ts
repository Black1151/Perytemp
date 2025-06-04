import { NextResponse } from 'next/server';
import CryptoJS from 'crypto-js';

export async function POST(req: Request) {
    try {
        const { encryptedData } = await req.json();
        const secretKey = process.env.ENCRYPTION_SECRET;

        if (!secretKey) {
            return NextResponse.json({ error: 'Encryption key not set' }, { status: 500 });
        }

        const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);

        return NextResponse.json({ decrypted });
    } catch (error) {
        return NextResponse.json({ error: 'Decryption failed' }, { status: 500 });
    }
}
