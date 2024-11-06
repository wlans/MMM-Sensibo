### MMM-Sensibo: MagicMirror Module for Sensibo Thermostats

**MMM-Sensibo** is a [MagicMirror](https://github.com/MichMich/MagicMirror) module that integrates with the Sensibo API to display a list of your Sensibo thermostats. Each thermostat displays the room name and target temperature, with a Font Awesome icon for easy recognition.

#### Key Features
- **Real-Time Thermostat Data**: Fetches and displays the current target temperature and room name for each thermostat linked to your Sensibo account.
- **View Toggle (Grid/List)**: Switch between a grid or list view directly on the MagicMirror interface using a toggle button. You can set the default view in the module’s configuration.

#### Installation

1. Clone this repository into your `MagicMirror/modules` folder:

   ```bash
   cd ~/MagicMirror/modules
   git clone https://github.com/YOUR_GITHUB_USERNAME/MMM-Sensibo.git
   cd MMM-Sensibo
   npm install
   ```

   This command installs Font Awesome and any other necessary dependencies.

2. Add the module to your MagicMirror `config.js` file:

   ```javascript
   {
       module: "MMM-Sensibo",
       position: "top_right", // Choose your preferred position
       config: {
           apiKey: "YOUR_SENSIBO_API_KEY", // Replace with your Sensibo API key
           view: "list" // Default view, can be "list" or "grid"
       }
   }
   ```

#### Configuration Options

| Option           | Description                                                                     | Default       |
|------------------|---------------------------------------------------------------------------------|---------------|
| `apiKey`         | **Required** Your Sensibo API key.                                              | `""`          |
| `updateInterval` | Interval (in milliseconds) between data refreshes.                              | `600000` (10 minutes) |
| `view`           | Display mode for thermostats: `"grid"` or `"list"`.                             | `"list"`      |

#### Usage
- **View Toggle**: A toggle button allows you to easily switch between list and grid views on the fly.
- **Customizable Styling**: The Font Awesome icons and layout styles are easy to customize through CSS. Custom styles can be added in the `MMM-Sensibo.css` file.

#### Dependencies
- [@fortawesome/fontawesome-free](https://fontawesome.com) for Font Awesome icons.

#### Example Screenshot

_Include a screenshot here of both grid and list views if possible!_

#### Contributing
Feel free to submit pull requests for new features, bug fixes, or improvements to the UI.

#### License

MIT License