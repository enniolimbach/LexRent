# Google Cloud Vision OCR Integration

## Übersicht

LexRent nutzt die Google Cloud Vision API für die automatische Texterkennung (OCR) aus hochgeladenen Mietverträgen (PDF/Bilder). 

## Funktionsweise

### 1. Architektur

```
Nutzer → Frontend → Backend → Google Cloud Vision API
                             ↓
                      Text-Extraktion
                             ↓
                      Smart Parsing
                             ↓
                      Vertragsdaten
```

### 2. Code-Komponenten

**Server-seitig:**
- `server/agents/ocrAgent.ts` - Hauptlogik für OCR-Verarbeitung
- `server/routes.ts` - API-Endpoint `/api/upload-contract`

**Client-seitig:**
- `client/src/pages/home.tsx` - File Upload und API-Call
- `client/src/components/FileUpload.tsx` - Drag & Drop Interface

### 3. Verarbeitungspipeline

1. **File Upload**: Nutzer lädt PDF/Bild hoch (max. 10MB)
2. **Buffer Processing**: File wird als Buffer an Backend gesendet
3. **Vision API Call**: `documentTextDetection()` extrahiert den kompletten Text
4. **Smart Parsing**: Regex-basierte Extraktion von:
   - Nettomiete (CHF-Beträge)
   - Referenzzinssatz (Prozentangaben)
   - Vertragsdatum (DD.MM.YYYY Format)
   - Adresse (Schweizer Postleitzahlen)
   - Kanton (26 Schweizer Kantone)
5. **Data Completion**: Fehlende Felder werden mit Mock-Daten ergänzt
6. **Validation**: Zod-Schema validiert die Daten
7. **Response**: JSON mit strukturierten Vertragsdaten

### 4. Fallback-Mechanismus

Die Integration hat mehrere Sicherheitsebenen:

```typescript
if (keine Credentials) → Mock-Daten
if (Vision API Fehler) → Mock-Daten  
if (kein Text gefunden) → Mock-Daten
if (Parsing fehlschlägt) → Felder mit Mock-Daten ergänzen
```

Dies garantiert, dass die App **immer funktioniert**, auch ohne API-Key.

## Kosten

**Google Cloud Vision Pricing:**
- **1.000 Requests/Monat**: KOSTENLOS
- 1.001 - 5.000.000: $1.50 pro 1.000 Requests
- Über 5.000.000: $0.60 pro 1.000 Requests

**Beispiel-Szenarien:**
- 100 Nutzer/Monat = $0 (Free Tier)
- 10.000 Nutzer/Monat = $13.50
- 100.000 Nutzer/Monat = $148.50

## Setup

### Voraussetzungen

1. Google Cloud Account mit aktivierter Vision API
2. Service Account JSON-Credentials
3. Replit Secret `GOOGLE_CLOUD_VISION_CREDENTIALS` gesetzt

### Environment Variable

Der OCR-Agent erwartet die Credentials als JSON-String:

```bash
GOOGLE_CLOUD_VISION_CREDENTIALS='{"type":"service_account","project_id":"...","private_key":"...",...}'
```

In Replit wird dies automatisch aus den Secrets geladen.

## Parsing-Logik

### Erkannte Muster

**Miete:**
```
CHF 2400
Fr. 2'400.00
2400.- Franken
```

**Referenzzinssatz:**
```
Referenzzinssatz 1,75
Reference rate: 1.75%
1,75%
```

**Datum:**
```
01.10.2019
1.10.2019
```

**Adresse:**
```
8006 Zürich
Nordstrasse 9, 8006 Zürich
```

### Verbesserungspotenzial

Die aktuelle Parsing-Logik ist **regelbasiert** (Regex). Für Produktion empfohlen:

1. **Natural Language Processing (NLP)**
   - spaCy für Named Entity Recognition
   - Custom-trainiertes Modell für Schweizer Mietverträge
   
2. **Strukturierte Datenextraktion**
   - Azure Form Recognizer (spezialisiert auf Formulare)
   - AWS Textract (spezialisiert auf Dokumente)
   
3. **Machine Learning**
   - Training mit echten Schweizer Mietverträgen
   - Kontinuierliche Verbesserung durch Nutzerfeedback

## Monitoring

Die OCR-Integration loggt detailliert:

```bash
[OCR Agent] Processing file: vertrag.pdf
[OCR Agent] File size: 471234 bytes
[OCR Agent] Calling Google Cloud Vision API...
[OCR Agent] Extracted text length: 2453
[OCR Agent] Parsed data from text: {...}
[OCR Agent] Extraction complete
```

Bei Fehlern:
```bash
[OCR Agent] Vision API error: [Error details]
[OCR Agent] Falling back to mock data
```

## Testing

### Manueller Test

1. Starten Sie die Anwendung
2. Laden Sie einen echten Mietvertrag hoch
3. Prüfen Sie die Browser-Konsole und Server-Logs
4. Verifizieren Sie die extrahierten Daten im Dialog

### Erwartetes Verhalten

- **Mit API-Key**: Echte OCR-Extraktion + Parsing + Fallback
- **Ohne API-Key**: Sofortiger Fallback zu Mock-Daten
- **API-Fehler**: Graceful Fallback zu Mock-Daten

## Sicherheit

✅ **Credentials nie im Code**: Nur über Environment Variables
✅ **Keine persistente Speicherung**: Files werden nur im Memory verarbeitet
✅ **HTTPS**: Sichere Kommunikation mit Google Cloud
✅ **Input Validation**: File-Type und Size-Checks

## Support

Bei Problemen prüfen:

1. Ist `GOOGLE_CLOUD_VISION_CREDENTIALS` korrekt gesetzt?
2. Sind die Credentials gültig? (Test: `console.log(JSON.parse(process.env.GOOGLE_CLOUD_VISION_CREDENTIALS))`)
3. Ist die Vision API aktiviert?
4. Sind die Server-Logs klar? (Fallback zu Mock-Daten?)
5. Funktioniert die App grundsätzlich ohne echte OCR?

## Nächste Schritte

- [ ] NLP-basiertes Parsing implementieren
- [ ] Custom-Training mit Schweizer Mietverträgen
- [ ] Nutzer-Feedback-Loop für Datenqualität
- [ ] A/B-Testing: Google Vision vs. Azure vs. Tesseract
- [ ] Monitoring Dashboard für Extraktion-Qualität
