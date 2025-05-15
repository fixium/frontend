<script>
    let search = "";
    let selectedTechnician = "";





    const devices = [
        {
            id: "24-05-15-01",
            image: "/iphone13.png",
            client: {
                name: "Andrea Ramírez",
                phone: "+52 646 123 4567"
            },
            technician: "T001",
            details: {
                deviceName: "iPhone 13",
                imei: "356789453210987",
                battery: "85%",
                serial: "C02ZX0A0Q6K1"
            }
        },
        {
            id: "24-05-15-02",
            image: "/phone.png",
            client: {
                name: "Luis García",
                phone: "+52 646 234 5678"
            },
            technician: "T002",
            details: {
                deviceName: "iPhone 14 Pro Max",
                imei: "358124678901234",
                battery: "92%",
                serial: "DNPX84L0H73T"
            }
        },
        {
            id: "24-05-15-03",
            image: "/iphone13.png",
            client: {
                name: "Carmen López",
                phone: "+52 646 345 6789"
            },
            technician: "T003",
            details: {
                deviceName: "iPhone 11",
                imei: "353982103948201",
                battery: "76%",
                serial: "F2LZQ0A0P6M3"
            }
        },
        {
            id: "24-05-15-04",
            image: "/iphone13.png",
            client: {
                name: "Ricardo Torres",
                phone: "+52 646 456 7890"
            },
            technician: "T001",
            details: {
                deviceName: "iPhone 12",
                imei: "359123098741256",
                battery: "68%",
                serial: "GHX93Q0DF8FJ"
            }
        },
        {
            id: "24-05-15-05",
            image: "/phone.png",
            client: {
                name: "Mariana Díaz",
                phone: "+52 646 567 8901"
            },
            technician: "T004",
            details: {
                deviceName: "iPhone 13 Pro",
                imei: "351234907856341",
                battery: "90%",
                serial: "JMK8W1A0S9L2"
            }
        },
        {
            id: "24-05-15-06",
            image: "/phone.png",
            client: {
                name: "José Martínez",
                phone: "+52 646 678 9012"
            },
            technician: "T002",
            details: {
                deviceName: "iPhone 14",
                imei: "354678213498742",
                battery: "82%",
                serial: "ZK9L5Q0CJ9MF"
            }
        },
        {
            id: "24-05-15-07",
            image: "/iphone13.png",
            client: {
                name: "Fernanda Ruiz",
                phone: "+52 646 789 0123"
            },
            technician: "T003",
            details: {
                deviceName: "iPhone 11 Pro",
                imei: "358971203948201",
                battery: "74%",
                serial: "LMKXP2L0T77Y"
            }
        },
        {
            id: "24-05-15-08",
            image: "/phone.png",
            client: {
                name: "Héctor Silva",
                phone: "+52 646 890 1234"
            },
            technician: "T004",
            details: {
                deviceName: "iPhone 12 Pro Max",
                imei: "356093214580123",
                battery: "88%",
                serial: "TRQZP9A0K6VF"
            }
        }
    ];

        $: filteredDevices = devices.filter(device => {
        const matchesSearch =
            device.id.toLowerCase().includes(search.toLowerCase()) ||
            device.client.name.toLowerCase().includes(search.toLowerCase());

        const matchesTechnician =
            selectedTechnician === "" || device.technician === selectedTechnician;

        return matchesSearch && matchesTechnician;
    });
</script>


<div class="container flex-1 min-h-screen flex flex-col items-center">
    <div class="header-bar">
        <div class="title-section">
            <h1>Dispositivos</h1>
            <h2>Taller</h2>
        </div>

        <div class="tools-section">
            <input
                type="text"
                placeholder="Buscar por cliente o ID..."
                class="search-input"
                bind:value={search}
            />
            <select class="filter-select" bind:value={selectedTechnician}>
                <option value="">Todos los técnicos</option>
                <option value="T001">T001</option>
                <option value="T002">T002</option>
                <option value="T003">T003</option>
                <option value="T004">T004</option>
            </select>
        </div>
    </div>

    <div class="cards">
        {#each filteredDevices as device}
            <div class="card">
                <div class="card-content">
                    <img src={device.image} alt={`Dispositivo ${device.id}`} class="card-image" />
                    <div>
                        <h3>{device.details.deviceName}</h3>
                        <p><strong>ID:</strong> {device.id}</p>
                        <p><strong>Cliente:</strong> {device.client.name}</p>
                        <p><strong>Teléfono:</strong> {device.client.phone}</p>
                        <p><strong>Técnico asignado:</strong> {device.technician}</p>
                        <p><strong>IMEI:</strong> {device.details.imei}</p>
                        <p><strong>Batería:</strong> {device.details.battery}</p>
                        <p><strong>Serial:</strong> {device.details.serial}</p>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>



<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        /* justify-content: center; */
        padding: 2rem;
        text-align: center;
    }

    h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        color: #333;
    }

    h2 {
        font-size: 1.8rem;
        margin-bottom: 2rem;
        color: #555;
    }

.cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    width: 100%;
    max-width: 1200px;
    justify-items: center; /* Centra las tarjetas cuando son menos */
}


    .card {
        flex: 1 1 300px; /* Mínimo 300px, no se expande más de lo necesario */
        max-width: 320px; /* Limita el crecimiento */
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        padding: 1rem;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .card:hover {
        transform: translateY(-10px);
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
    }

    .card-content {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .card-image {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 8px;
    }

    .card h3 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        color: #007bff;
    }

    .card p {
        font-size: 0.9rem;
        color: #555;
        line-height: 1.4;
        text-align: left;
    }

    .header-bar {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    width: 100%;
    max-width: 1200px;
    margin-bottom: 2rem;
    gap: 1rem;
    flex-wrap: wrap;
}

.title-section {
    text-align: left;
}

.tools-section {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.search-input,
.filter-select {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border-radius: 8px;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    transition: all 0.2s ease;
}

.search-input:focus,
.filter-select:focus {
    border-color: #007bff;
    outline: none;
    background-color: #fff;
}
</style>