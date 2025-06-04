import { NextResponse } from 'next/server';
import CryptoJS from 'crypto-js';

export async function POST(req: Request) {
    try {
        const { data } = await req.json();
        const secretKey = process.env.ENCRYPTION_SECRET;

        if (!secretKey) {
            return NextResponse.json({ error: 'Encryption key not set' }, { status: 500 });
        }

        const encrypted = CryptoJS.AES.encrypt(data, secretKey).toString();

        return NextResponse.json({ encrypted });
    } catch (error) {
        return NextResponse.json({ error: 'Encryption failed' }, { status: 500 });
    }
}
