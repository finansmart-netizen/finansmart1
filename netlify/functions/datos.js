const { getStore } = require('@netlify/blobs');

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const store = getStore({
            name: 'finansmart',
            siteID: process.env.BLOBS_SITE_ID,
            token: process.env.BLOBS_TOKEN
        });

        const key = 'datos_principales';

        if (event.httpMethod === 'GET') {
            const data = await store.get(key, { type: 'json' });
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(data || { plantillas: {}, usuarios: {}, version: 2 })
            };
        }

        if (event.httpMethod === 'PUT' || event.httpMethod === 'POST') {
            const body = JSON.parse(event.body);
            await store.setJSON(key, body);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ ok: true, guardado: new Date().toISOString() })
            };
        }

        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Método no permitido' })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
