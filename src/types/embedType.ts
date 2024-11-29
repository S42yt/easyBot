
type EmbedType = {
    colour?: null | string;
    description?: null | string;
    fields?: null | string;
    footer?: null | string;
    icon_url?: null | string;
    media?: null | string;
    title?: null | string;
    url?: null | string;
    timestamp?: null | string;
  };
  
  class EmbedBuilder {
    private embed: EmbedType;
  
    constructor() {
      this.embed = {};
    }
  
    setColour(colour: string): EmbedBuilder {
      this.embed.colour = colour;
      return this;
    }
  
    setDescription(description: string): EmbedBuilder {
      this.embed.description = description;
      return this;
    }

    addField(name: string, value: string): EmbedBuilder {
        if (!this.embed.fields) {
          this.embed.fields = '';
        }
        this.embed.fields += `${name}: ${value}\n`;
        return this;
      }

    setFooter(footer: string): EmbedBuilder {
        this.embed.footer = footer;
        return this;
      }
  
  
    setIconUrl(icon_url: string): EmbedBuilder {
      this.embed.icon_url = icon_url;
      return this;
    }
  
    setMedia(media: string): EmbedBuilder {
      this.embed.media = media;
      return this;
    }
  
    setTitle(title: string): EmbedBuilder {
      this.embed.title = title;
      return this;
    }
  
    setUrl(url: string): EmbedBuilder {
      this.embed.url = url;
      return this;
    }

    setTimestamp(timestamp: string): EmbedBuilder {
        this.embed.timestamp = timestamp;
        return this;
      }
  
    build(): EmbedType {
      return this.embed;
    }
  }
  
  export default EmbedBuilder;