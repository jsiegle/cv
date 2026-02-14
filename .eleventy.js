import { readFileSync } from "node:fs";
import matter from "gray-matter";
import markdownIt from "markdown-it";

const md = markdownIt({ html: true, linkify: true });

function asList(value) {
  return Array.isArray(value) ? value : [];
}

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addGlobalData("lastUpdated", () =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(new Date())
  );

  eleventyConfig.addFilter("renderMd", (content) => md.render(content || ""));
  eleventyConfig.addFilter("renderInlineMd", (content) => md.renderInline(content || ""));

  eleventyConfig.addGlobalData("cv", () => {
    const raw = readFileSync("src/data/cv.md", "utf8");
    const parsed = matter(raw);

    return {
      profile: parsed.data.profile || {},
      links: asList(parsed.data.links),
      positions: asList(parsed.data.positions),
      education: asList(parsed.data.education),
      publications: {
        highlights: asList(parsed.data.publications?.highlights),
        complete: asList(parsed.data.publications?.complete)
      },
      awards: {
        highlights: asList(parsed.data.awards?.highlights),
        complete: asList(parsed.data.awards?.complete)
      },
      teaching: {
        highlights: asList(parsed.data.teaching?.highlights || parsed.data.teaching?.higlights),
        complete: asList(parsed.data.teaching?.complete)
      },
      talks: {
        highlights: asList(parsed.data.talks?.highlights),
        complete: asList(parsed.data.talks?.complete)
      },
      service: asList(parsed.data.service),
      summaryHtml: md.render(parsed.content || "")
    };
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site"
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
}
