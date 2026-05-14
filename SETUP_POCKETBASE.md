# PRE&CON PocketBase Setup Guide

This document contains the complete collection schemas to set up PocketBase for the PRE&CON website.

## Collections Overview

All collections use `base` type unless specified otherwise.

---

## 1. SERVICES (`services`)

**Type:** `collection`

| Field Name       | Type     | Required | Unique | Other Defaults          |
|------------------|----------|----------|--------|-------------------------|
| slug             | text     | ✓        | ✓      |                         |
| title            | text     | ✓        |        |                         |
| shortDescription  | text     | ✓        |        |                         |
| fullDescription  | text     | ✓        |        | multiline               |
| features         | json     |          |        |                         |
| image            | file     |          |        | single file             |
| icon             | text     |          |        | default: "Settings"     |
| order            | number   |          |        | default: 0              |
| isActive         | bool     |          |        | default: true           |

**API Rules:**
- List: authenticated+ (or public read if desired)
- Show: authenticated+
- Create: admin only
- Update: admin only
- Delete: admin only

---

## 2. PROJECTS (`projects`)

**Type:** `collection`

| Field Name        | Type     | Required | Unique | Other Defaults          |
|-------------------|----------|----------|--------|-------------------------|
| slug              | text     | ✓        | ✓      |                         |
| clientName        | text     | ✓        |        |                         |
| title             | text     | ✓        |        |                         |
| location          | text     |          |        |                         |
| description       | text     | ✓        |        | multiline               |
| servicesProvided  | json     |          |        |                         |
| images            | files    |          |        | multiple files          |
| category          | select   |          |        | transmission, distribution, photovoltaic, industrial, residential |
| year              | number   |          |        |                         |
| isFeatured        | bool     |          |        | default: false          |
| isActive          | bool     |          |        | default: true           |

**API Rules:**
- List/Show: public
- Create/Update/Delete: admin only

---

## 3. CLIENTS (`clients`)

**Type:** `collection`

| Field Name | Type     | Required | Unique | Other Defaults |
|------------|----------|----------|--------|----------------|
| name       | text     | ✓        |        |                |
| logo       | file     |          |        | single file    |
| website    | text     |          |        |                |
| order      | number   |          |        | default: 0     |
| isActive   | bool     |          |        | default: true  |

**API Rules:**
- List/Show: public
- Create/Update/Delete: admin only

---

## 4. CONTACTS (`contacts`)

**Type:** `collection`

| Field Name  | Type     | Required | Unique | Other Defaults |
|-------------|----------|----------|--------|----------------|
| firstName   | text     | ✓        |        |                |
| lastName    | text     | ✓        |        |                |
| phone       | text     | ✓        |        |                |
| company     | text     |          |        |                |
| email       | email    | ✓        |        |                |
| subject     | text     | ✓        |        |                |
| message     | text     | ✓        |        | multiline      |
| status      | select   |          |        | new, read, replied, archived (default: new) |

**API Rules:**
- List: admin only
- Show: admin only
- Create: public (contact form submission)
- Update: admin only
- Delete: admin only

---

## 5. PAGES (`pages`)

**Type:** `collection`

| Field Name        | Type     | Required | Unique | Other Defaults |
|-------------------|----------|----------|--------|----------------|
| slug              | text     | ✓        | ✓      |                |
| title             | text     | ✓        |        |                |
| content           | json     |          |        |                |
| metaTitle         | text     |          |        |                |
| metaDescription   | text     |          |        |                |
| isActive          | bool     |          |        | default: true  |

**API Rules:**
- List/Show: public
- Create/Update/Delete: admin only

---

## 6. SITECONFIG (`siteConfig`)

**Type:** `collection`

| Field Name | Type     | Required | Unique | Other Defaults |
|------------|----------|----------|--------|----------------|
| key        | text     | ✓        | ✓      |                |
| value      | text     | ✓        |        |                |
| group      | select   |          |        | general, contact, social, seo (default: general) |

**API Rules:**
- List/Show: public
- Create/Update/Delete: admin only

---

## 7. STATS (`stats`)

**Type:** `collection`

| Field Name | Type     | Required | Unique | Other Defaults |
|------------|----------|----------|--------|----------------|
| label      | text     | ✓        |        |                |
| value      | text     | ✓        |        |                |
| prefix     | text     |          |        |                |
| suffix     | text     |          |        |                |
| order      | number   |          |        | default: 0     |
| isActive   | bool     |          |        | default: true  |

**API Rules:**
- List/Show: public
- Create/Update/Delete: admin only

---

## Initial Seed Data Summary

See `seed-data.json` for all seed records.

### Services (4):
1. Transmisión Eléctrica (slug: `transmision-electrica`)
2. Distribución Eléctrica (slug: `distribucion-electrica`)
3. Energías Renovables (slug: `energias-renovables`)
4. Estudios y Certificaciones (slug: `estudios-y-certificaciones`)

### Projects (6):
1. Línea de Transmisión 220kV Atacama (transmission, 2023)
2. Subestación Eléctrica Patagonia (distribution, 2023)
3. Planta Solar Fotovoltaica Atacama (photovoltaic, 2024)
4. Red de Distribución Industrial Minera (industrial, 2024)
5. Proyecto Residencial Verde (residential, 2024)
6. Sistema Fotovoltaico Corporativo (photovoltaic, 2025)

### Clients (8):
CGE, Transelec, Enel, AES Chile, Colbún, Pacific Energy, Grupo Saesa, Engie

### Stats (4):
1. Años de Experiencia: 15+
2. Proyectos Completados: 200+
3. Clientes Satisfechos: 150+
4. MW Instalados: 500+

### SiteConfig (11 entries):
companyName, companyTagline, contactEmail, contactPhone, contactAddress, contactCity, facebookUrl, linkedinUrl, instagramUrl, defaultMetaTitle, defaultMetaDescription