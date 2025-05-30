const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function uploadCSV(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to upload CSV');
    }

    return response.json();
}

export async function settleBatch(batchId) {
    const response = await fetch(`${BASE_URL}/settle/${batchId}`, {
        method: 'POST',
    });

    if (!response.ok) {
        throw new Error('Failed to settle batch');
    }

    return response.json();
}

export async function fetchRecentBatches() {
    const response = await fetch(`${BASE_URL}/batches`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch batches');
    }

    return response.json();
}

// NOTE: This function was added to support the frontend pulling ALL batches (for dynamic metrics and time filtering).
export async function fetchAllBatches() {
    const response = await fetch(`${BASE_URL}/batches/all`);
    if (!response.ok) {
        throw new Error('Failed to fetch all batches');
    }
    return response.json();
}

// HUMAN NOTE: This function supports filtered batch queries based on time range or start/end.
export async function fetchBatchesFiltered({ start, end, timeRange }) {
    let url = `${BASE_URL}/batches/filter`;

    if (timeRange) {
        url += `?timeRange=${timeRange}`;
    } else if (start && end) {
        url += `?start=${start}&end=${end}`;
    } else {
        throw new Error('Provide either timeRange or start/end');
    }

    const response = await fetch(url, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch filtered batches');
    }

    return response.json();
}

// HUMAN NOTE: This function fetches summary business metrics (total volume, success rate, etc.)
export async function fetchSummaryMetrics() {
    const response = await fetch(`${BASE_URL}/summary`);
    if (!response.ok) {
        throw new Error('Failed to fetch summary metrics');
    }
    return response.json();
}