import type { _Blog_liquid, _Article_liquid, _Color_liquid, _BlockTag, _Collection_liquid, _Page_liquid, _Product_liquid, _Image_liquid, _Video_liquid, _Font_liquid, _Font_options, _Linklist_liquid } from "./shopify.js";
import type { ThemeBlocks, GlobalThemeBlocks } from "./blocks.js";
export type CardSection = {
  blocks: CardBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: checkbox */
    link_to_object: boolean;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    dynamic_background_color?: string;
    /** Input type: text */
    dynamic_border_color?: string;
    /** Input type: text */
    dynamic_text_color?: string;
    /** Input type: text */
    handle?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: color */
    override_preview_background?: _Color_liquid | string;
    /** Input type: article */
    preview_article?: _Article_liquid | string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "__card";
};

export type CardBlocks =
  | Extract<ThemeBlocks, { type: "_card__container" }>
  | Extract<ThemeBlocks, { type: "_card__image" }>
  | Extract<ThemeBlocks, { type: "_card__button" }>
  | Extract<ThemeBlocks, { type: "_card__text" }>
  | Extract<ThemeBlocks, { type: "_card__labels" }>;

export type CardArticleCardSection = {
  blocks: CardArticleCardBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: checkbox */
    link_to_object: boolean;
    /** Input type: metaobject */
    article_card?: string;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    dynamic_background_color?: string;
    /** Input type: text */
    dynamic_border_color?: string;
    /** Input type: text */
    dynamic_text_color?: string;
    /** Input type: text */
    handle?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: color */
    override_preview_background?: _Color_liquid | string;
    /** Input type: article */
    preview_article?: _Article_liquid | string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "__card_article_card";
};

export type CardArticleCardBlocks =
  | Extract<ThemeBlocks, { type: "_card__container" }>
  | Extract<ThemeBlocks, { type: "_card__image" }>
  | Extract<ThemeBlocks, { type: "_card__button" }>
  | Extract<ThemeBlocks, { type: "_card__text" }>
  | Extract<ThemeBlocks, { type: "_card__labels" }>;

export type CardBlogCardSection = {
  blocks: CardBlogCardBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: checkbox */
    link_to_object: boolean;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: metaobject */
    blog_card?: string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    dynamic_background_color?: string;
    /** Input type: text */
    dynamic_border_color?: string;
    /** Input type: text */
    dynamic_text_color?: string;
    /** Input type: text */
    handle?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: color */
    override_preview_background?: _Color_liquid | string;
    /** Input type: blog */
    preview_blog?: _Blog_liquid | string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "__card_blog_card";
};

export type CardBlogCardBlocks =
  | Extract<ThemeBlocks, { type: "_card__container" }>
  | Extract<ThemeBlocks, { type: "_card__image" }>
  | Extract<ThemeBlocks, { type: "_card__button" }>
  | Extract<ThemeBlocks, { type: "_card__text" }>
  | Extract<ThemeBlocks, { type: "_card__labels" }>;

export type CardCollectionCardSection = {
  blocks: CardCollectionCardBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: checkbox */
    link_to_object: boolean;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: metaobject */
    collection_card?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    dynamic_background_color?: string;
    /** Input type: text */
    dynamic_border_color?: string;
    /** Input type: text */
    dynamic_text_color?: string;
    /** Input type: text */
    handle?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: color */
    override_preview_background?: _Color_liquid | string;
    /** Input type: collection */
    preview_collection?: _Collection_liquid;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "__card_collection_card";
};

export type CardCollectionCardBlocks =
  | Extract<ThemeBlocks, { type: "_card__container" }>
  | Extract<ThemeBlocks, { type: "_card__image" }>
  | Extract<ThemeBlocks, { type: "_card__button" }>
  | Extract<ThemeBlocks, { type: "_card__text" }>
  | Extract<ThemeBlocks, { type: "_card__labels" }>;

export type CardCommentCardSection = {
  blocks: CardCommentCardBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: metaobject */
    comment_card?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    handle?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: color */
    override_preview_background?: _Color_liquid | string;
    /** Input type: article */
    preview_article?: _Article_liquid | string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "__card_comment_card";
};

export type CardCommentCardBlocks =
  | Extract<ThemeBlocks, { type: "_card__container" }>
  | Extract<ThemeBlocks, { type: "_card__image" }>
  | Extract<ThemeBlocks, { type: "_card__button" }>
  | Extract<ThemeBlocks, { type: "_card__text" }>
  | Extract<ThemeBlocks, { type: "_card__labels" }>;

export type CardLineItemCardSection = {
  blocks: CardLineItemCardBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    dynamic_background_color?: string;
    /** Input type: text */
    dynamic_border_color?: string;
    /** Input type: text */
    dynamic_text_color?: string;
    /** Input type: text */
    handle?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: metaobject */
    line_item_card?: string;
    /** Input type: color */
    override_preview_background?: _Color_liquid | string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "__card_line_item_card";
};

export type CardLineItemCardBlocks =
  | Extract<ThemeBlocks, { type: "_card_line_item_card__container" }>
  | Extract<ThemeBlocks, { type: "_card_line_item_card__image" }>
  | Extract<ThemeBlocks, { type: "_card_line_item_card__richtext" }>
  | Extract<ThemeBlocks, { type: "_card_line_item_card__button" }>
  | Extract<ThemeBlocks, { type: "_card_line_item_card__price" }>
  | Extract<ThemeBlocks, { type: "_card_line_item_card__quantity_selector" }>
  | Extract<ThemeBlocks, { type: "_card_line_item_card__quantity_picker" }>
  | Extract<ThemeBlocks, { type: "_card_line_item_card__remove_button" }>
  | Extract<ThemeBlocks, { type: "_card_line_item_card__subscription_selector" }>
  | Extract<ThemeBlocks, { type: "_card_line_item_card__subscription_button" }>
  | Extract<ThemeBlocks, { type: "_card_line_item_card__properties" }>
  | Extract<ThemeBlocks, { type: "_card_line_item_card__discounts" }>
  | Extract<ThemeBlocks, { type: "_card_line_item_card__addon_items" }>;

export type CardPageCardSection = {
  blocks: CardPageCardBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: checkbox */
    link_to_object: boolean;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    dynamic_background_color?: string;
    /** Input type: text */
    dynamic_border_color?: string;
    /** Input type: text */
    dynamic_text_color?: string;
    /** Input type: text */
    handle?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: color */
    override_preview_background?: _Color_liquid | string;
    /** Input type: metaobject */
    page_card?: string;
    /** Input type: page */
    preview_page?: _Page_liquid | string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "__card_page_card";
};

export type CardPageCardBlocks =
  | Extract<ThemeBlocks, { type: "_card__container" }>
  | Extract<ThemeBlocks, { type: "_card__image" }>
  | Extract<ThemeBlocks, { type: "_card__button" }>
  | Extract<ThemeBlocks, { type: "_card__text" }>
  | Extract<ThemeBlocks, { type: "_card__labels" }>;

export type CardProductCardSection = {
  blocks: CardProductCardBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: checkbox */
    default_select_selling_plan: boolean;
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: checkbox */
    link_to_object: boolean;
    /** Input type: checkbox */
    open_in_new_tab: boolean;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    default_variant_metafield?: string;
    /** Input type: text */
    dynamic_background_color?: string;
    /** Input type: text */
    dynamic_border_color?: string;
    /** Input type: text */
    dynamic_text_color?: string;
    /** Input type: text */
    handle?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: color */
    override_preview_background?: _Color_liquid | string;
    /** Input type: product */
    preview_product?: _Product_liquid;
    /** Input type: metaobject */
    product_card?: string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "__card_product_card";
};

export type CardProductCardBlocks =
  | Extract<ThemeBlocks, { type: "custom_liquid" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__container" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__collapsible" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__image" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__gallery" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__richtext" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__button" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__price" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__labels" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__rating" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__accent_line" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__cta_button" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__add_to_cart_toggle" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__variant_selector__select" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__variant_selector__radio" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__variant_selector__color" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__option__color" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__option__radio" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__option__select" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__addon_checkbox" }>;

export type DataArticleJsonSection = {
  blocks: never[];
  id: string;
  disabled?: boolean;
  settings?: {
  };
  type: "__data_article_json";
};

export type DataCartJsonSection = {
  blocks: never[];
  id: string;
  disabled?: boolean;
  settings?: {
  };
  type: "__data_cart_json";
};

export type DataCollectionJsonSection = {
  blocks: never[];
  id: string;
  disabled?: boolean;
  settings?: {
  };
  type: "__data_collection_json";
};

export type DataPageJsonSection = {
  blocks: never[];
  id: string;
  disabled?: boolean;
  settings?: {
  };
  type: "__data_page_json";
};

export type DataPredictiveSearchSection = {
  blocks: never[];
  id: string;
  disabled?: boolean;
  settings?: {
  };
  type: "__data_predictive_search";
};

export type DataProductJsonSection = {
  blocks: never[];
  id: string;
  disabled?: boolean;
  settings?: {
  };
  type: "__data_product_json";
};

export type GlobalButtonsSection = {
  blocks: GlobalButtonsBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: text */
    category_name?: string;
    /** Input type: text */
    hidden_name_backup?: string;
  };
  type: "__global_buttons";
};

export type GlobalButtonsBlocksButton = {
  id: string;
  settings: {
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    override_preview_background?: _Color_liquid | string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "button";
};

export type GlobalButtonsBlocksLabel = {
  id: string;
  settings: {
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    override_preview_background?: _Color_liquid | string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "label";
};

export type GlobalButtonsBlocks =
  | GlobalButtonsBlocksButton
  | GlobalButtonsBlocksLabel;

export type GlobalDesignElementsSection = {
  blocks: GlobalDesignElementsBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: text */
    category_name?: string;
    /** Input type: text */
    hidden_name_backup?: string;
  };
  type: "__global_design_elements";
};

export type GlobalDesignElementsBlocksSelect = {
  id: string;
  settings: {
    /** Input type: text */
    class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    icon?: string;
    /** Input type: color */
    override_preview_background?: _Color_liquid | string;
  };
  type: "select";
};

export type GlobalDesignElementsBlocksQuantity = {
  id: string;
  settings: {
    /** Input type: text */
    class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    label?: string;
    /** Input type: color */
    override_preview_background?: _Color_liquid | string;
  };
  type: "quantity";
};

export type GlobalDesignElementsBlocksCheckbox = {
  id: string;
  settings: {
    /** Input type: text */
    class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    icon?: string;
    /** Input type: color */
    override_preview_background?: _Color_liquid | string;
  };
  type: "checkbox";
};

export type GlobalDesignElementsBlocksInput = {
  id: string;
  settings: {
    /** Input type: text */
    class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    override_preview_background?: _Color_liquid | string;
  };
  type: "input";
};

export type GlobalDesignElementsBlocksTextarea = {
  id: string;
  settings: {
    /** Input type: text */
    class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    override_preview_background?: _Color_liquid | string;
  };
  type: "textarea";
};

export type GlobalDesignElementsBlocksAccordion = {
  id: string;
  settings: {
    /** Input type: select */
    icon_style: "plus" | "icon_plain" | "icon_rotating" | "none";
    /** Input type: text */
    class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    icon?: string;
    /** Input type: color */
    override_preview_background?: _Color_liquid | string;
    /** Input type: text */
    richtext_class?: string;
  };
  type: "accordion";
};

export type GlobalDesignElementsBlocksScrollbar = {
  id: string;
  settings: {
    /** Input type: select */
    icon_style: "animated" | "icon" | "image_icon";
    /** Input type: text */
    class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    icon_next?: string;
    /** Input type: text */
    icon_previous?: string;
    /** Input type: color */
    override_preview_background?: _Color_liquid | string;
  };
  type: "scrollbar";
};

export type GlobalDesignElementsBlocksScrollPagination = {
  id: string;
  settings: {
    /** Input type: text */
    class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    override_preview_background?: _Color_liquid | string;
  };
  type: "scroll_pagination";
};

export type GlobalDesignElementsBlocksPagination = {
  id: string;
  settings: {
    /** Input type: text */
    class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    icon_next?: string;
    /** Input type: text */
    icon_previous?: string;
    /** Input type: color */
    override_preview_background?: _Color_liquid | string;
  };
  type: "pagination";
};

export type GlobalDesignElementsBlocks =
  | GlobalDesignElementsBlocksSelect
  | GlobalDesignElementsBlocksQuantity
  | GlobalDesignElementsBlocksCheckbox
  | GlobalDesignElementsBlocksInput
  | GlobalDesignElementsBlocksTextarea
  | GlobalDesignElementsBlocksAccordion
  | GlobalDesignElementsBlocksScrollbar
  | GlobalDesignElementsBlocksScrollPagination
  | GlobalDesignElementsBlocksPagination;

export type GlobalIconsSection = {
  blocks: GlobalIconsBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: text */
    category_name?: string;
    /** Input type: text */
    hidden_name_backup?: string;
  };
  type: "__global_icons";
};

export type GlobalIconsBlocksIcon = {
  id: string;
  settings: {
    /** Input type: range */
    aspect_ratio: number;
    /** Input type: text */
    handle?: string;
    /** Input type: image_picker */
    icon?: _Image_liquid | string;
    /** Input type: textarea */
    svg_code?: string;
    /** Input type: url */
    url?: string;
  };
  type: "icon";
};

export type GlobalIconsBlocks = GlobalIconsBlocksIcon;

export type GlobalPageTransitionsSection = {
  blocks: never[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: checkbox */
    enable: boolean;
    /** Input type: checkbox */
    enable_loading_screen: boolean;
    /** Input type: range */
    loading_screen__hide_for: number;
    /** Input type: range */
    logo_height_desktop: number;
    /** Input type: range */
    logo_height_mobile: number;
    /** Input type: select */
    theme_editor_preview: "page_transition" | "loading_screen";
    /** Input type: color */
    background_color_desktop?: _Color_liquid | string;
    /** Input type: color */
    background_color_mobile?: _Color_liquid | string;
    /** Input type: textarea */
    ignore_routes?: string;
    /** Input type: color */
    loading_screen__background_color?: _Color_liquid | string;
    /** Input type: text */
    loading_screen__cookie_key?: string;
    /** Input type: video */
    loading_screen__desktop_video?: _Video_liquid;
    /** Input type: video */
    loading_screen__mobile_video?: _Video_liquid;
    /** Input type: image_picker */
    logo_desktop?: _Image_liquid | string;
    /** Input type: image_picker */
    logo_mobile?: _Image_liquid | string;
  };
  type: "__global_page_transitions";
};

export type GlobalSwatchesSection = {
  blocks: GlobalSwatchesBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: text */
    preview_options?: string;
  };
  type: "__global_swatches";
};

export type GlobalSwatchesBlocksColorSwatch = {
  id: string;
  settings: {
    /** Input type: color */
    swatch?: _Color_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "color_swatch";
};

export type GlobalSwatchesBlocksColorGradientSwatch = {
  id: string;
  settings: {
    /** Input type: color_background */
    swatch?: string;
    /** Input type: text */
    title?: string;
  };
  type: "color_gradient_swatch";
};

export type GlobalSwatchesBlocksImageSwatch = {
  id: string;
  settings: {
    /** Input type: image_picker */
    image?: _Image_liquid | string;
    /** Input type: text */
    title?: string;
  };
  type: "image_swatch";
};

export type GlobalSwatchesBlocks =
  | GlobalSwatchesBlocksColorSwatch
  | GlobalSwatchesBlocksColorGradientSwatch
  | GlobalSwatchesBlocksImageSwatch;

export type GlobalTypographySection = {
  blocks: GlobalTypographyBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
  };
  type: "__global_typography";
};

export type GlobalTypographyBlocksFont = {
  id: string;
  settings: {
    /** Input type: font_picker */
    family: _Font_liquid | _Font_options;
    /** Input type: liquid */
    custom_src?: string;
    /** Input type: text */
    fallback_families?: string;
    /** Input type: text */
    font_name?: string;
    /** Input type: text */
    weights?: string;
  };
  type: "font";
};

export type GlobalTypographyBlocksRichtext = {
  id: string;
  settings: {
    /** Input type: text */
    class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: textarea */
    h1_custom_css?: string;
    /** Input type: textarea */
    h2_custom_css?: string;
    /** Input type: textarea */
    h3_custom_css?: string;
    /** Input type: textarea */
    h4_custom_css?: string;
    /** Input type: textarea */
    h5_custom_css?: string;
    /** Input type: textarea */
    h6_custom_css?: string;
    /** Input type: textarea */
    ol_custom_css?: string;
    /** Input type: textarea */
    p_custom_css?: string;
    /** Input type: textarea */
    ul_custom_css?: string;
  };
  type: "richtext";
};

export type GlobalTypographyBlocksHeading = {
  id: string;
  settings: {
    /** Input type: text */
    class?: string;
    /** Input type: textarea */
    custom_css?: string;
  };
  type: "heading";
};

export type GlobalTypographyBlocks =
  | GlobalTypographyBlocksFont
  | GlobalTypographyBlocksRichtext
  | GlobalTypographyBlocksHeading;

export type HeaderAnnouncementBarSection = {
  blocks: HeaderAnnouncementBarBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "__header_announcement_bar";
};

export type HeaderAnnouncementBarBlocks =
  | Extract<ThemeBlocks, { type: "marquee" }>
  | GlobalThemeBlocks
  | Extract<ThemeBlocks, { type: "_header_announcement_bar__close_button" }>;

export type HeaderNavigationBarSection = {
  blocks: HeaderNavigationBarBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: textarea */
    transparent_custom_css?: string;
    /** Input type: textarea */
    transparent_templates?: string;
  };
  type: "__header_navigation_bar";
};

export type HeaderNavigationBarBlocks =
  | GlobalThemeBlocks
  | Extract<ThemeBlocks, { type: "_header_navigation_bar__menu" }>
  | Extract<ThemeBlocks, { type: "_main_cart__progress_bar" }>
  | Extract<ThemeBlocks, { type: "_header_navigation_bar__container" }>
  | Extract<ThemeBlocks, { type: "_header_navigation_bar__burger_menu_button" }>
  | Extract<ThemeBlocks, { type: "_header_navigation_bar__megamenu_button" }>
  | Extract<ThemeBlocks, { type: "_header_navigation_bar__search_button" }>
  | Extract<ThemeBlocks, { type: "_header_navigation_bar__search_button_with_bar" }>
  | Extract<ThemeBlocks, { type: "_header_navigation_bar__cart_button" }>
  | Extract<ThemeBlocks, { type: "_header_navigation_bar__account_button" }>
  | Extract<ThemeBlocks, { type: "_header_navigation_bar__dynamic_display_container" }>;

export type MainAccountSection = {
  blocks: MainAccountBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "__main_account";
};

export type MainAccountBlocks =
  | Extract<ThemeBlocks, { type: "_main_account__container" }>
  | Extract<ThemeBlocks, { type: "_main_account__orders_table" }>
  | Extract<ThemeBlocks, { type: "_main_account__order" }>
  | Extract<ThemeBlocks, { type: "_main_account__addresses" }>
  | Extract<ThemeBlocks, { type: "_main_account__default_address" }>
  | Extract<ThemeBlocks, { type: "_main_account__new_address_button" }>;

export type MainArticleSection = {
  blocks: MainArticleBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "__main_article";
};

export type MainArticleBlocks =
  | GlobalThemeBlocks
  | Extract<ThemeBlocks, { type: "tab_navigation" }>
  | Extract<ThemeBlocks, { type: "slider" }>
  | Extract<ThemeBlocks, { type: "_main_article__container" }>
  | Extract<ThemeBlocks, { type: "_main_article__pagination" }>
  | Extract<ThemeBlocks, { type: "_main_article__comment_cards" }>;

export type MainBlogSection = {
  blocks: MainBlogBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "__main_blog";
};

export type MainBlogBlocks =
  | GlobalThemeBlocks
  | Extract<ThemeBlocks, { type: "_filter_tags" }>
  | Extract<ThemeBlocks, { type: "_main_blog__container" }>
  | Extract<ThemeBlocks, { type: "_main_blog__filters" }>
  | Extract<ThemeBlocks, { type: "_main_blog__article_cards" }>
  | Extract<ThemeBlocks, { type: "_main_blog__filter_button" }>
  | Extract<ThemeBlocks, { type: "_main_blog__empty_state" }>;

export type MainCartSection = {
  blocks: MainCartBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "__main_cart";
};

export type MainCartBlocks =
  | Extract<ThemeBlocks, { type: "_main_cart__checkout_button" }>
  | Extract<ThemeBlocks, { type: "_main_cart__discount_details" }>
  | Extract<ThemeBlocks, { type: "_main_cart__discount_code_input" }>
  | Extract<ThemeBlocks, { type: "_main_cart__dynamic_richtext" }>
  | Extract<ThemeBlocks, { type: "_main_cart__gift_with_purchase" }>
  | Extract<ThemeBlocks, { type: "_main_cart__note" }>
  | Extract<ThemeBlocks, { type: "_main_cart__progress_bar" }>
  | Extract<ThemeBlocks, { type: "_main_cart__progress_bar_stacked" }>
  | Extract<ThemeBlocks, { type: "_main_cart__total" }>
  | Extract<ThemeBlocks, { type: "_main_cart__collapsible" }>
  | Extract<ThemeBlocks, { type: "_main_cart__dynamic_checkout_button" }>
  | Extract<ThemeBlocks, { type: "_main_cart__container" }>
  | Extract<ThemeBlocks, { type: "_main_cart__subscription_selector" }>
  | Extract<ThemeBlocks, { type: "_main_cart__subscription_button" }>
  | Extract<ThemeBlocks, { type: "_main_cart__line_item_bundle" }>
  | GlobalThemeBlocks;

export type MainCollectionSection = {
  blocks: MainCollectionBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "__main_collection";
};

export type MainCollectionBlocks =
  | GlobalThemeBlocks
  | Extract<ThemeBlocks, { type: "slider" }>
  | Extract<ThemeBlocks, { type: "_filter_tags" }>
  | Extract<ThemeBlocks, { type: "_main_collection__product_count" }>
  | Extract<ThemeBlocks, { type: "_main_collection__container" }>
  | Extract<ThemeBlocks, { type: "_main_collection__collapsible" }>
  | Extract<ThemeBlocks, { type: "_main_collection__filter_sidebar" }>
  | Extract<ThemeBlocks, { type: "_main_collection__applied_count" }>
  | Extract<ThemeBlocks, { type: "_main_collection__applied_filters" }>
  | Extract<ThemeBlocks, { type: "_main_collection__filters" }>
  | Extract<ThemeBlocks, { type: "_main_collection__sort" }>
  | Extract<ThemeBlocks, { type: "_main_collection__filter_submit_button" }>
  | Extract<ThemeBlocks, { type: "_main_collection__filter_clear_button" }>
  | Extract<ThemeBlocks, { type: "_main_collection__filter_button" }>
  | Extract<ThemeBlocks, { type: "_main_collection__product_cards" }>
  | Extract<ThemeBlocks, { type: "_main_collection__empty_state" }>;

export type MainListCollectionsSection = {
  blocks: MainListCollectionsBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "__main_list_collections";
};

export type MainListCollectionsBlocks =
  | Extract<ThemeBlocks, { type: "breadcrumbs" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "_main_list_collections__container" }>
  | Extract<ThemeBlocks, { type: "_main_list_collections__collection_cards" }>
  | Extract<ThemeBlocks, { type: "_main_list_collections__empty_state" }>;

export type MainProductSection = {
  blocks: MainProductBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: checkbox */
    default_select_selling_plan: boolean;
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: range */
    supports_addon_products: number;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    default_variant_metafield?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: product */
    product?: _Product_liquid;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "__main_product";
};

export type MainProductBlocks =
  | Extract<ThemeBlocks, { type: "slider" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "_main_product__container" }>
  | Extract<ThemeBlocks, { type: "_main_product__collapsible_container" }>
  | Extract<ThemeBlocks, { type: "_main_product__availability" }>
  | Extract<ThemeBlocks, { type: "_main_product__selected_plan_duration" }>
  | Extract<ThemeBlocks, { type: "_main_product__gallery" }>
  | Extract<ThemeBlocks, { type: "_main_product__thumbnails" }>
  | Extract<ThemeBlocks, { type: "_main_product__price" }>
  | Extract<ThemeBlocks, { type: "_main_product__rating" }>
  | Extract<ThemeBlocks, { type: "_main_product__quantity_selector" }>
  | Extract<ThemeBlocks, { type: "_main_product__custom_quantity_selector" }>
  | Extract<ThemeBlocks, { type: "_main_product__add_to_cart_button" }>
  | Extract<ThemeBlocks, { type: "_main_product__cta_button" }>
  | Extract<ThemeBlocks, { type: "_main_product__description" }>
  | Extract<ThemeBlocks, { type: "_main_product__option__color" }>
  | Extract<ThemeBlocks, { type: "_main_product__option__color_w_caption" }>
  | Extract<ThemeBlocks, { type: "_main_product__option__radio" }>
  | Extract<ThemeBlocks, { type: "_main_product__option__radio_detailed" }>
  | Extract<ThemeBlocks, { type: "_main_product__option__select" }>
  | Extract<ThemeBlocks, { type: "_main_product__variant_selector__color" }>
  | Extract<ThemeBlocks, { type: "_main_product__variant_selector__radio" }>
  | Extract<ThemeBlocks, { type: "_main_product__variant_selector__select" }>
  | Extract<ThemeBlocks, { type: "_main_product__sibling__color" }>
  | Extract<ThemeBlocks, { type: "_main_product__sibling__radio" }>
  | Extract<ThemeBlocks, { type: "_main_product__sibling__select" }>
  | Extract<ThemeBlocks, { type: "_main_product__sibling__color_select" }>
  | Extract<ThemeBlocks, { type: "_main_product__sibling__scent_sidebar" }>
  | Extract<ThemeBlocks, { type: "_main_product__subscribe__button_select" }>
  | Extract<ThemeBlocks, { type: "_main_product__subscribe__button_card" }>
  | Extract<ThemeBlocks, { type: "_main_product__subscribe__button_switch" }>
  | Extract<ThemeBlocks, { type: "_main_product__subscribe__toggle_card" }>
  | Extract<ThemeBlocks, { type: "_main_product__payment_terms" }>
  | Extract<ThemeBlocks, { type: "_main_product__dynamic_buy_button" }>
  | Extract<ThemeBlocks, { type: "_main_product__dynamic_text" }>
  | Extract<ThemeBlocks, { type: "_main_product__image" }>
  | Extract<ThemeBlocks, { type: "_main_product__labels" }>
  | Extract<ThemeBlocks, { type: "_main_product__gift_card_recipient" }>
  | Extract<ThemeBlocks, { type: "_main_product__bundle_variants" }>
  | Extract<ThemeBlocks, { type: "_main_product__gallery_button" }>
  | Extract<ThemeBlocks, { type: "_main_product__rebuy_popup" }>
  | GlobalThemeBlocks
  | Extract<ThemeBlocks, { type: "_main_product__addons_atc_button" }>;

export type MainProductBarSection = {
  blocks: MainProductBarBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: select */
    sticky: "" | "top" | "bottom";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: product */
    product?: _Product_liquid;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "__main_product_bar";
};

export type MainProductBarBlocks =
  | Extract<ThemeBlocks, { type: "menu" }>
  | Extract<ThemeBlocks, { type: "slider" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "_main_product__container" }>
  | Extract<ThemeBlocks, { type: "_main_product__collapsible_container" }>
  | Extract<ThemeBlocks, { type: "_main_product__availability" }>
  | Extract<ThemeBlocks, { type: "_main_product__selected_plan_duration" }>
  | Extract<ThemeBlocks, { type: "_main_product__gallery" }>
  | Extract<ThemeBlocks, { type: "_main_product__thumbnails" }>
  | Extract<ThemeBlocks, { type: "_main_product__price" }>
  | Extract<ThemeBlocks, { type: "_main_product__rating" }>
  | Extract<ThemeBlocks, { type: "_main_product__quantity_selector" }>
  | Extract<ThemeBlocks, { type: "_main_product__custom_quantity_selector" }>
  | Extract<ThemeBlocks, { type: "_main_product__add_to_cart_button" }>
  | Extract<ThemeBlocks, { type: "_main_product__cta_button" }>
  | Extract<ThemeBlocks, { type: "_main_product__description" }>
  | Extract<ThemeBlocks, { type: "_main_product__option__color" }>
  | Extract<ThemeBlocks, { type: "_main_product__option__color_w_caption" }>
  | Extract<ThemeBlocks, { type: "_main_product__option__radio" }>
  | Extract<ThemeBlocks, { type: "_main_product__option__radio_detailed" }>
  | Extract<ThemeBlocks, { type: "_main_product__option__select" }>
  | Extract<ThemeBlocks, { type: "_main_product__variant_selector__color" }>
  | Extract<ThemeBlocks, { type: "_main_product__variant_selector__radio" }>
  | Extract<ThemeBlocks, { type: "_main_product__variant_selector__select" }>
  | Extract<ThemeBlocks, { type: "_main_product__sibling__color" }>
  | Extract<ThemeBlocks, { type: "_main_product__sibling__radio" }>
  | Extract<ThemeBlocks, { type: "_main_product__sibling__select" }>
  | Extract<ThemeBlocks, { type: "_main_product__sibling__color_select" }>
  | Extract<ThemeBlocks, { type: "_main_product__sibling__scent_sidebar" }>
  | Extract<ThemeBlocks, { type: "_main_product__subscribe__button_select" }>
  | Extract<ThemeBlocks, { type: "_main_product__subscribe__button_card" }>
  | Extract<ThemeBlocks, { type: "_main_product__subscribe__button_switch" }>
  | Extract<ThemeBlocks, { type: "_main_product__subscribe__toggle_card" }>
  | Extract<ThemeBlocks, { type: "_main_product__payment_terms" }>
  | Extract<ThemeBlocks, { type: "_main_product__dynamic_buy_button" }>
  | Extract<ThemeBlocks, { type: "_main_product__dynamic_text" }>
  | Extract<ThemeBlocks, { type: "_main_product__image" }>
  | Extract<ThemeBlocks, { type: "_main_product__labels" }>
  | Extract<ThemeBlocks, { type: "_main_product__gift_card_recipient" }>
  | Extract<ThemeBlocks, { type: "_main_product__bundle_variants" }>
  | Extract<ThemeBlocks, { type: "_main_product__gallery_button" }>
  | Extract<ThemeBlocks, { type: "_main_product__rebuy_popup" }>
  | GlobalThemeBlocks
  | Extract<ThemeBlocks, { type: "_main_product__addons_atc_button" }>;

export type MainSearchSection = {
  blocks: MainSearchBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "__main_search";
};

export type MainSearchBlocks =
  | GlobalThemeBlocks
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "slider" }>
  | Extract<ThemeBlocks, { type: "_filter_tags" }>
  | Extract<ThemeBlocks, { type: "_main_search__product_count" }>
  | Extract<ThemeBlocks, { type: "_main_search__dynamic_text" }>
  | Extract<ThemeBlocks, { type: "_main_search__container" }>
  | Extract<ThemeBlocks, { type: "_main_search__collapsible" }>
  | Extract<ThemeBlocks, { type: "_main_search__filter_sidebar" }>
  | Extract<ThemeBlocks, { type: "_main_search__applied_filters" }>
  | Extract<ThemeBlocks, { type: "_main_search__filters" }>
  | Extract<ThemeBlocks, { type: "_main_search__sort" }>
  | Extract<ThemeBlocks, { type: "_main_search__filter_submit_button" }>
  | Extract<ThemeBlocks, { type: "_main_search__filter_clear_button" }>
  | Extract<ThemeBlocks, { type: "_main_search__filter_button" }>
  | Extract<ThemeBlocks, { type: "_main_search__mixed_cards" }>
  | Extract<ThemeBlocks, { type: "_main_search__empty_state" }>
  | Extract<ThemeBlocks, { type: "_main_search__search_input" }>;

export type ModalBackInStockNotificationSection = {
  blocks: never[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: checkbox */
    enable_phone_capture: boolean;
    /** Input type: checkbox */
    enable_subscribe_checkbox: boolean;
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: text */
    api_key?: string;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    button_class?: string;
    /** Input type: inline_richtext */
    button_content?: string;
    /** Input type: text */
    category_name?: string;
    /** Input type: text */
    checkbox_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: richtext */
    footer?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    footer_class?: string;
    /** Input type: richtext */
    heading?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    heading_class?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    input_class?: string;
    /** Input type: text */
    input_label?: string;
    /** Input type: text */
    input_label_phone?: string;
    /** Input type: text */
    input_placeholder?: string;
    /** Input type: text */
    input_placeholder_phone?: string;
    /** Input type: text */
    klaviyo_list_id?: string;
    /** Input type: text */
    section_id?: string;
    /** Input type: text */
    select_class?: string;
    /** Input type: inline_richtext */
    subscribe_label?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "__modal_back_in_stock_notification";
};

export type ModalCountrySelectorSection = {
  blocks: never[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: checkbox */
    show_flag: boolean;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: text */
    close_icon?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    section_id?: string;
    /** Input type: text */
    text_class?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "__modal_country_selector";
};

export type ModalDynamicProductSection = {
  blocks: ModalDynamicProductBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: checkbox */
    backwards_sync_state: boolean;
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: checkbox */
    default_select_selling_plan: boolean;
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    default_variant_metafield?: string;
    /** Input type: text */
    dynamic_background_color?: string;
    /** Input type: text */
    dynamic_border_color?: string;
    /** Input type: text */
    dynamic_text_color?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    modal_handle?: string;
    /** Input type: product */
    preview_product?: _Product_liquid;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "__modal_dynamic_product";
};

export type ModalDynamicProductBlocks =
  | Extract<ThemeBlocks, { type: "custom_liquid" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__container" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__collapsible" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__image" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__gallery" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__richtext" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__button" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__price" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__labels" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__rating" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__accent_line" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__cta_button" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__add_to_cart_toggle" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__variant_selector__select" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__variant_selector__radio" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__variant_selector__color" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__option__color" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__option__radio" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__option__select" }>
  | Extract<ThemeBlocks, { type: "_card_product_card__addon_checkbox" }>;

export type ModalMediaGallerySection = {
  blocks: ModalMediaGalleryBlocks[];
  id: string;
  disabled?: boolean;
  settings?: {
  };
  type: "__modal_media_gallery";
};

export type ModalMediaGalleryBlocksVerticalGallery = {
  id: string;
  settings: {
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "vertical_gallery";
};

export type ModalMediaGalleryBlocksVideoProductGallery = {
  id: string;
  settings: {
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: metaobject */
    product_card_class?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "video_product_gallery";
};

export type ModalMediaGalleryBlocks =
  | ModalMediaGalleryBlocksVerticalGallery
  | ModalMediaGalleryBlocksVideoProductGallery;

export type ModalMegamenuSection = {
  blocks: ModalMegamenuBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    handle?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "__modal_megamenu";
};

export type ModalMegamenuBlocks =
  | Extract<ThemeBlocks, { type: "image" }>
  | Extract<ThemeBlocks, { type: "menu" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | GlobalThemeBlocks;

export type ModalPopupSection = {
  blocks: ModalPopupBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    desktop_animation: "opacity" | "slide_from_top" | "slide_from_right" | "slide_from_bottom" | "slide_from_left";
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: select */
    mobile_animation: "opacity" | "slide_from_top" | "slide_from_right" | "slide_from_bottom" | "slide_from_left";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    modal_handle?: string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "__modal_popup";
};

export type ModalPopupBlocks =
  | Extract<ThemeBlocks, { type: "button" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "image" }>
  | Extract<ThemeBlocks, { type: "image_with_caption" }>
  | GlobalThemeBlocks;

export type ModalQuickViewSection = {
  blocks: ModalQuickViewBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: product */
    preview_product?: _Product_liquid;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "__modal_quick_view";
};

export type ModalQuickViewBlocks =
  | Extract<ThemeBlocks, { type: "_modal_quick_view__close_button" }>
  | Extract<ThemeBlocks, { type: "_modal_quick_view__view_button" }>;

export type ModalSearchSection = {
  blocks: ModalSearchBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: checkbox */
    author: boolean;
    /** Input type: checkbox */
    body: boolean;
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: range */
    limit: number;
    /** Input type: select */
    limit_type: "each" | "all";
    /** Input type: checkbox */
    product_type: boolean;
    /** Input type: checkbox */
    tag: boolean;
    /** Input type: checkbox */
    title: boolean;
    /** Input type: select */
    unavailable_products: "show" | "hide" | "last";
    /** Input type: checkbox */
    variants_barcode: boolean;
    /** Input type: checkbox */
    variants_sku: boolean;
    /** Input type: checkbox */
    variants_title: boolean;
    /** Input type: checkbox */
    vendor: boolean;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "__modal_search";
};

export type ModalSearchBlocks =
  | GlobalThemeBlocks
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "button" }>
  | Extract<ThemeBlocks, { type: "_modal_search__dynamic_text" }>
  | Extract<ThemeBlocks, { type: "_modal_search__static_search_suggestion" }>
  | Extract<ThemeBlocks, { type: "_modal_search__dynamic_search_suggestions" }>
  | Extract<ThemeBlocks, { type: "_modal_search__product_result_cards" }>
  | Extract<ThemeBlocks, { type: "_modal_search__collection_result_cards" }>
  | Extract<ThemeBlocks, { type: "_modal_search__page_result_cards" }>
  | Extract<ThemeBlocks, { type: "_modal_search__article_result_cards" }>
  | Extract<ThemeBlocks, { type: "_modal_search__search_input" }>
  | Extract<ThemeBlocks, { type: "_modal_search__container" }>
  | Extract<ThemeBlocks, { type: "_modal_search__loading_overlay" }>;

export type ModalSidebarMenuSection = {
  blocks: ModalSidebarMenuBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: range */
    limit: number;
    /** Input type: select */
    limit_type: "each" | "all";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    handle?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "__modal_sidebar_menu";
};

export type ModalSidebarMenuBlocks =
  | GlobalThemeBlocks
  | Extract<ThemeBlocks, { type: "image" }>
  | Extract<ThemeBlocks, { type: "menu" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "tab_navigation" }>
  | Extract<ThemeBlocks, { type: "_modal_search__container" }>;

export type ModalSidebarSubmenuSection = {
  blocks: ModalSidebarSubmenuBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    handle?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "__modal_sidebar_submenu";
};

export type ModalSidebarSubmenuBlocks =
  | GlobalThemeBlocks
  | Extract<ThemeBlocks, { type: "image" }>
  | Extract<ThemeBlocks, { type: "menu" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "tab_navigation" }>
  | Extract<ThemeBlocks, { type: "_modal_search__container" }>;

export type AppsSection = {
  blocks: GlobalThemeBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: text */
    custom_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_apps";
};

export type AppsBlocks =
  | GlobalThemeBlocks;

export type BundleSection = {
  blocks: BundleBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    bundle_target_type: "total_price" | "item_count";
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: checkbox */
    disable_product_links: boolean;
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: select */
    incentive_target_type: "total_price" | "final_price" | "item_count";
    /** Input type: select */
    restrict_bundle_quantity: "hard_limit" | "upgrade_limit" | "no_limit";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_bundle";
};

export type BundleBlocks =
  | Extract<ThemeBlocks, { type: "image" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "slider" }>
  | Extract<ThemeBlocks, { type: "_main_cart__progress_bar" }>
  | Extract<ThemeBlocks, { type: "tab_navigation" }>
  | Extract<ThemeBlocks, { type: "tab_content" }>
  | GlobalThemeBlocks
  | Extract<ThemeBlocks, { type: "_bundle__dynamic_richtext" }>
  | Extract<ThemeBlocks, { type: "_bundle__container" }>
  | Extract<ThemeBlocks, { type: "_bundle__added_products" }>
  | Extract<ThemeBlocks, { type: "_bundle__add_button" }>
  | Extract<ThemeBlocks, { type: "_bundle__bundle_selector" }>;

export type BundleWithTabsSection = {
  blocks: BundleWithTabsBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    button_class?: string;
    /** Input type: inline_richtext */
    button_content?: string;
    /** Input type: inline_richtext */
    button_content_items_added?: string;
    /** Input type: text */
    category_name?: string;
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: richtext */
    heading?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    heading_class?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: product */
    parent_product?: _Product_liquid;
    /** Input type: image_picker */
    placeholder_image?: _Image_liquid | string;
    /** Input type: text */
    price_class?: string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_bundle_with_tabs";
};

export type BundleWithTabsBlocks =
  | Extract<ThemeBlocks, { type: "tab_navigation" }>
  | Extract<ThemeBlocks, { type: "_bundle_with_tabs__tab_items" }>;

export type ColorWheelSection = {
  blocks: ColorWheelBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_color_wheel";
};

export type ColorWheelBlocks =
  | Extract<ThemeBlocks, { type: "_color_wheel__dynamic_richtext" }>
  | Extract<ThemeBlocks, { type: "scrollbar" }>
  | Extract<ThemeBlocks, { type: "_color_wheel__color_picker" }>
  | Extract<ThemeBlocks, { type: "_color_wheel__container" }>
  | Extract<ThemeBlocks, { type: "_color_wheel__product_cards" }>;

export type ContentBannerSection = {
  blocks: ContentBannerBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_content_banner";
};

export type ContentBannerBlocks =
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "image" }>
  | Extract<ThemeBlocks, { type: "button" }>
  | Extract<ThemeBlocks, { type: "star_rating" }>
  | GlobalThemeBlocks;

export type CustomCodeSection = {
  blocks: CustomCodeBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_custom_code";
};

export type CustomCodeBlocksCss = {
  id: string;
  settings: {
    /** Input type: textarea */
    css?: string;
  };
  type: "css";
};

export type CustomCodeBlocksLiquid = {
  id: string;
  settings: {
    /** Input type: liquid */
    custom_liquid?: string;
  };
  type: "liquid";
};

export type CustomCodeBlocksJavascript = {
  id: string;
  settings: {
    /** Input type: textarea */
    javascript?: string;
  };
  type: "javascript";
};

export type CustomCodeBlocksJson = {
  id: string;
  settings: {
    /** Input type: textarea */
    json?: string;
  };
  type: "json";
};

export type CustomCodeBlocks =
  | CustomCodeBlocksCss
  | CustomCodeBlocksLiquid
  | CustomCodeBlocksJavascript
  | CustomCodeBlocksJson;

export type FeaturedBenefitsSliderSection = {
  blocks: FeaturedBenefitsSliderBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    content_mobile_style: "expand" | "slider";
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: select */
    image_mobile_style: "fullscreen" | "container";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    icon?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_featured_benefits_slider";
};

export type FeaturedBenefitsSliderBlocksFeature = {
  id: string;
  settings: {
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: image_picker */
    image?: _Image_liquid | string;
  };
  type: "feature";
};

export type FeaturedBenefitsSliderBlocks = FeaturedBenefitsSliderBlocksFeature;

export type FooterSection = {
  blocks: FooterBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_footer";
};

export type FooterBlocks =
  | Extract<ThemeBlocks, { type: "form" }>
  | Extract<ThemeBlocks, { type: "button" }>
  | Extract<ThemeBlocks, { type: "custom_liquid" }>
  | Extract<ThemeBlocks, { type: "menu" }>
  | Extract<ThemeBlocks, { type: "image" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "social_icons" }>
  | Extract<ThemeBlocks, { type: "collapsible" }>
  | GlobalThemeBlocks
  | Extract<ThemeBlocks, { type: "_footer__international_store_select" }>
  | Extract<ThemeBlocks, { type: "_footer__container" }>;

export type GenericSectionSection = {
  blocks: GenericSectionBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_generic_section";
};

export type GenericSectionBlocks =
  | Extract<ThemeBlocks, { type: "button" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "image" }>
  | Extract<ThemeBlocks, { type: "image_with_caption" }>
  | GlobalThemeBlocks;

export type FeaturedBenefitsSection = {
  blocks: FeaturedBenefitsBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    icon?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: richtext */
    title?: `<${_BlockTag}${string}</${_BlockTag}>`;
  };
  type: "featured_benefits";
};

export type FeaturedBenefitsBlocksFeature = {
  id: string;
  settings: {
    /** Input type: select */
    dynamic_content_type: "default" | "metafield";
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: image_picker */
    image?: _Image_liquid | string;
    /** Input type: text */
    metafield_content_key?: string;
    /** Input type: text */
    metafield_image_key?: string;
    /** Input type: text */
    metafield_namespace_key?: string;
    /** Input type: text */
    metafield_title_key?: string;
    /** Input type: richtext */
    title?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    title_class?: string;
  };
  type: "feature";
};

export type FeaturedBenefitsBlocks = FeaturedBenefitsBlocksFeature;

export type HotspotsSection = {
  blocks: HotspotsBlocks[];
  id: string;
  disabled?: boolean;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    generate_presets: "never" | "always" | "manual_override";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    section_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "hotspots";
};

export type HotspotsBlocks =
  | Extract<ThemeBlocks, { type: "_hotspots__canvas" }>
  | Extract<ThemeBlocks, { type: "_hotspots__container" }>;

export type Sections =
  | CardSection
  | CardArticleCardSection
  | CardBlogCardSection
  | CardCollectionCardSection
  | CardCommentCardSection
  | CardLineItemCardSection
  | CardPageCardSection
  | CardProductCardSection
  | DataArticleJsonSection
  | DataCartJsonSection
  | DataCollectionJsonSection
  | DataPageJsonSection
  | DataPredictiveSearchSection
  | DataProductJsonSection
  | GlobalButtonsSection
  | GlobalDesignElementsSection
  | GlobalIconsSection
  | GlobalPageTransitionsSection
  | GlobalSwatchesSection
  | GlobalTypographySection
  | HeaderAnnouncementBarSection
  | HeaderNavigationBarSection
  | MainAccountSection
  | MainArticleSection
  | MainBlogSection
  | MainCartSection
  | MainCollectionSection
  | MainListCollectionsSection
  | MainProductSection
  | MainProductBarSection
  | MainSearchSection
  | ModalBackInStockNotificationSection
  | ModalCountrySelectorSection
  | ModalDynamicProductSection
  | ModalMediaGallerySection
  | ModalMegamenuSection
  | ModalPopupSection
  | ModalQuickViewSection
  | ModalSearchSection
  | ModalSidebarMenuSection
  | ModalSidebarSubmenuSection
  | AppsSection
  | BundleSection
  | BundleWithTabsSection
  | ColorWheelSection
  | ContentBannerSection
  | CustomCodeSection
  | FeaturedBenefitsSliderSection
  | FooterSection
  | GenericSectionSection
  | FeaturedBenefitsSection
  | HotspotsSection;
