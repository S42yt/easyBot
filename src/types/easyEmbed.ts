type EmbedType = {
    colour?: null | string;
    description?: null | string;
    fields?: null | string;
    footer?: null | { text: string; iconURL?: string };
    icon_url?: null | string;
    media?: null | string;
    title?: null | string;
    url?: null | string;
    timestamp?: null | string;
  };
  
  class EasyEmbed {
    private embed: EmbedType;
  
    constructor() {
      this.embed = {};
    }
  
    setColour(colour: string): EasyEmbed {
      this.embed.colour = colour;
      return this;
    }
  
    setDescription(description: string): EasyEmbed {
      this.embed.description = description;
      return this;
    }

    addField(name: string, value: string): EasyEmbed {
        if (!this.embed.fields) {
          this.embed.fields = '';
        }
        this.embed.fields += `${name}: ${value}\n`;
        return this;
      }

    setFooter(footer: { text: string; iconURL?: string }): EasyEmbed {
        this.embed.footer = footer;
        return this;
      }
  
  
    setIconUrl(icon_url: string): EasyEmbed {
      this.embed.icon_url = icon_url;
      return this;
    }
  
    setMedia(media: string): EasyEmbed {
      this.embed.media = media;
      return this;
    }
  
    setTitle(title: string): EasyEmbed {
      this.embed.title = title;
      return this;
    }
  
    setUrl(url: string): EasyEmbed {
      this.embed.url = url;
      return this;
    }

    setTimestamp(timestamp: string): EasyEmbed {
        this.embed.timestamp = timestamp;
        return this;
      }
  
    build(): EmbedType {
      return this.embed;
    }
  }
  
  export default EasyEmbed;