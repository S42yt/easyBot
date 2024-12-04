import EmbedBuilder from './easyEmbed';

class ErrorEmbed extends EmbedBuilder {
    constructor() {
        super();
        this.setColour('#FF0000'); // Red color for error
    }
}

export default ErrorEmbed;