import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  // Überprüfe die Anmeldedaten (hier solltest du deine Logik zur Überprüfung der Anmeldedaten einfügen)
  if (username === 'admin' && password === 'dein_passwort') { // Beispielüberprüfung
    const token = jwt.sign({ username }, process.env.JWT_SECRET!, { expiresIn: '1h' }); // Token generieren
    return NextResponse.json({ token });
  } else {
    return NextResponse.json({ message: 'Ungültige Anmeldedaten' }, { status: 401 });
  }
} 