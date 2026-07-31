// @ts-nocheck
import * as __fd_glob_25 from "../content/docs/reference/configuration-files.mdx?collection=docs"
import * as __fd_glob_24 from "../content/docs/reference/available-commands.mdx?collection=docs"
import * as __fd_glob_23 from "../content/docs/guides/theming.mdx?collection=docs"
import * as __fd_glob_22 from "../content/docs/guides/managing-translations.mdx?collection=docs"
import * as __fd_glob_21 from "../content/docs/guides/adding-ui-components.mdx?collection=docs"
import * as __fd_glob_20 from "../content/docs/deployment/web.mdx?collection=docs"
import * as __fd_glob_19 from "../content/docs/deployment/ios.mdx?collection=docs"
import * as __fd_glob_18 from "../content/docs/deployment/desktop.mdx?collection=docs"
import * as __fd_glob_17 from "../content/docs/deployment/ci-cd.mdx?collection=docs"
import * as __fd_glob_16 from "../content/docs/deployment/android.mdx?collection=docs"
import * as __fd_glob_15 from "../content/docs/architecture/web-app.mdx?collection=docs"
import * as __fd_glob_14 from "../content/docs/architecture/ui-package.mdx?collection=docs"
import * as __fd_glob_13 from "../content/docs/architecture/typescript-config.mdx?collection=docs"
import * as __fd_glob_12 from "../content/docs/architecture/overview.mdx?collection=docs"
import * as __fd_glob_11 from "../content/docs/architecture/native-app.mdx?collection=docs"
import * as __fd_glob_10 from "../content/docs/architecture/i18n-package.mdx?collection=docs"
import * as __fd_glob_9 from "../content/docs/architecture/core-package.mdx?collection=docs"
import * as __fd_glob_8 from "../content/docs/architecture/cli-package.mdx?collection=docs"
import * as __fd_glob_7 from "../content/docs/tech-stack.mdx?collection=docs"
import * as __fd_glob_6 from "../content/docs/quick-start.mdx?collection=docs"
import * as __fd_glob_5 from "../content/docs/index.mdx?collection=docs"
import { default as __fd_glob_4 } from "../content/docs/reference/meta.json?collection=docs"
import { default as __fd_glob_3 } from "../content/docs/guides/meta.json?collection=docs"
import { default as __fd_glob_2 } from "../content/docs/deployment/meta.json?collection=docs"
import { default as __fd_glob_1 } from "../content/docs/architecture/meta.json?collection=docs"
import { default as __fd_glob_0 } from "../content/docs/meta.json?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();

export const docs = await create.docs("docs", "content/docs", {"meta.json": __fd_glob_0, "architecture/meta.json": __fd_glob_1, "deployment/meta.json": __fd_glob_2, "guides/meta.json": __fd_glob_3, "reference/meta.json": __fd_glob_4, }, {"index.mdx": __fd_glob_5, "quick-start.mdx": __fd_glob_6, "tech-stack.mdx": __fd_glob_7, "architecture/cli-package.mdx": __fd_glob_8, "architecture/core-package.mdx": __fd_glob_9, "architecture/i18n-package.mdx": __fd_glob_10, "architecture/native-app.mdx": __fd_glob_11, "architecture/overview.mdx": __fd_glob_12, "architecture/typescript-config.mdx": __fd_glob_13, "architecture/ui-package.mdx": __fd_glob_14, "architecture/web-app.mdx": __fd_glob_15, "deployment/android.mdx": __fd_glob_16, "deployment/ci-cd.mdx": __fd_glob_17, "deployment/desktop.mdx": __fd_glob_18, "deployment/ios.mdx": __fd_glob_19, "deployment/web.mdx": __fd_glob_20, "guides/adding-ui-components.mdx": __fd_glob_21, "guides/managing-translations.mdx": __fd_glob_22, "guides/theming.mdx": __fd_glob_23, "reference/available-commands.mdx": __fd_glob_24, "reference/configuration-files.mdx": __fd_glob_25, });