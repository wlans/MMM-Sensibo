/* MagicMirror Module: MMM-Sensibo
 * By Wyatt
 * MIT Licensed
 */

Module.register("MMM-Sensibo", {
    defaults: {
        apiKey: "",
        updateInterval: 10 * 60 * 1000, // Update every 10 minutes
        view: "list" // "list" or "grid"
    },

    start: function () {
        this.thermostats = [];
        this.getData();
        this.scheduleUpdate();
    },

    getStyles: function () {
        return ["MMM-Sensibo.css", "modules/MMM-Sensibo/node_modules/@fortawesome/fontawesome-free/css/all.min.css"];
    },

    getData: function () {
        const url = `https://home.sensibo.com/api/v2/users/me/pods?apiKey=${this.config.apiKey}&fields=room,pod,acState`;

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    this.thermostats = data.result;
                    this.updateDom();
                } else {
                    console.error("MMM-Sensibo: Failed to fetch data");
                }
            })
            .catch((error) => {
                console.error("MMM-Sensibo: Error fetching data", error);
            });
    },

    scheduleUpdate: function () {
        setInterval(() => {
            this.getData();
        }, this.config.updateInterval);
    },

    getDom: function () {
        const wrapper = document.createElement("div");
        wrapper.className = `sensibo-thermostats ${this.config.view}`;

        if (this.thermostats.length === 0) {
            wrapper.innerHTML = "Loading thermostats...";
            return wrapper;
        }

        this.thermostats.forEach((thermostat) => {
            const item = document.createElement("div");
            item.className = "thermostat-item";

            const icon = document.createElement("i");
            icon.className = "fas fa-thermometer-half"; // Font Awesome icon
            item.appendChild(icon);

            const name = document.createElement("span");
            name.className = "thermostat-name";
            name.innerHTML = `${thermostat.room.name} - ${thermostat.acState.targetTemperature}°C`;
            item.appendChild(name);

            wrapper.appendChild(item);
        });

        return wrapper;
    },
});
