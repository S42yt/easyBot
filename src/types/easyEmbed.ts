class EasyEmbed {
  private embed: {
      colour?: string | null;
      description?: string | null;
      fields?: { name: string; value: string }[] | null;
      footer?: { text: string; iconURL?: string } | null;
      icon_url?: string | null;
      media?: string | null;
      title?: string | null;
      url?: string | null;
      timestamp?: string | null;
  };

  constructor() {
      this.embed = {
          colour: null,
          description: null,
          fields: [],
          footer: null,
          icon_url: null,
          media: null,
          title: null,
          url: null,
          timestamp: null
      };
  }

  setTitle(title: string): EasyEmbed {
      this.embed.title = title;
      return this;
  }

  setDescription(description: string): EasyEmbed {
      this.embed.description = description;
      return this;
  }

  addField(name: string, value: string): EasyEmbed {
      if (!this.embed.fields) {
          this.embed.fields = [];
      }
      this.embed.fields.push({ name, value });
      return this;
  }

  setFooter(text: string, iconURL?: string): EasyEmbed {
      this.embed.footer = { text, iconURL };
      return this;
  }

  setColour(colour: string): EasyEmbed {
      this.embed.colour = colour;
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

  setUrl(url: string): EasyEmbed {
      this.embed.url = url;
      return this;
  }

  setTimestamp(timestamp: string): EasyEmbed {
      this.embed.timestamp = timestamp;
      return this;
  }

  build(): any {
      return this.embed;
  }
}

export default EasyEmbed;