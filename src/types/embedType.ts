import { TextEmbed, API } from 'revolt.js';

export type EmbedOptions = {
    title?: string;
    description?: string;
    color?: string;
    fields?: { name: string; value: string; inline?: boolean }[];
    thumbnail?: string;
    image?: string;
    footer?: { text: string; icon_url?: string };
    timestamp?: string;
    url?: string;
    author?: { name: string; url?: string; icon_url?: string };
};

export function createEmbed(options: EmbedOptions): TextEmbed {
    // Create the embed object
    const embed = new TextEmbed();

    // Set the title if provided
    if (options.title) {
        embed.setTitle(options.title);
    }

    // Set the description if provided
    if (options.description) {
        embed.setDescription(options.description);
    }

    // Set the color if provided
    if (options.color) {
        embed.setColor(options.color);  // Using 'setColor' as it's more typical for color methods
    }

    // Add fields if provided
    if (options.fields) {
        options.fields.forEach(field => {
            embed.addField(field.name, field.value, field.inline);
        });
    }

    // Set the thumbnail if provided
    if (options.thumbnail) {
        embed.setThumbnail(options.thumbnail);
    }

    // Set the image if provided
    if (options.image) {
        embed.setImage(options.image);
    }

    // Set the footer if provided
    if (options.footer) {
        embed.setFooter(options.footer.text, options.footer.icon_url);
    }

    // Set the timestamp if provided
    if (options.timestamp) {
        embed.setTimestamp(new Date(options.timestamp).getTime());  // Make sure it's in milliseconds
    }

    if (options.url) {
        embed.setURL(options.url);
    }

    if (options.author) {
        embed.setAuthor(options.author.name, options.author.icon_url, options.author.url);
    }

    return embed;
}
