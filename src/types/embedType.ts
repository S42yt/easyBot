
type EmbedType = {
    colour?: null | string;
    description?: null | string;
    icon_url?: null | string;
    media?: null | string;
    title?: null | string;
    url?: null | string;
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
  
    build(): EmbedType {
      return this.embed;
    }
  }
  
  export default EmbedBuilder;