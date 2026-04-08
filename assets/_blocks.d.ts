import type { _Blog_liquid, _Collection_liquid, _Color_liquid, _Article_liquid, _Product_liquid, _Image_liquid, _BlockTag, _Video_liquid, _Linklist_liquid } from "./shopify.js";

export type FilterTagsBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: checkbox */
    enable_mouse_dragging: boolean;
    /** Input type: select */
    infinite_scroll: "off" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start" | "snap-m md:[&>*]:snap-start [&>*]:snap-center";
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
  };
  type: "_filter_tags";
};

export type BreadcrumbsBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: checkbox */
    product_vendor_collection: boolean;
    /** Input type: checkbox */
    show_all_collections_step: boolean;
    /** Input type: checkbox */
    show_home_route: boolean;
    /** Input type: text */
    content?: string;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    divider_color?: _Color_liquid | string;
    /** Input type: text */
    home_label?: string;
    /** Input type: text */
    icon?: string;
    /** Input type: color */
    inactive_text_color?: _Color_liquid | string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: url */
    url?: string;
  };
  type: "breadcrumbs";
};

export type ButtonBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: select */
    dynamic_content_type: "default" | "metafield";
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: checkbox */
    show_active_state: boolean;
    /** Input type: select */
    tab_group: "0" | "1" | "2";
    /** Input type: checkbox */
    trigger_on_hover: boolean;
    /** Input type: select */
    type: "button" | "submit" | "reset" | "popup" | "modal" | "sub_modal" | "modal_close" | "submenu_close" | "toggle_collapsible" | "trigger_tab";
    /** Input type: text */
    accessibility_label?: string;
    /** Input type: text */
    button_class?: string;
    /** Input type: text */
    collapsible_handle?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    metafield_accessibility_label_key?: string;
    /** Input type: text */
    metafield_label_key?: string;
    /** Input type: text */
    metafield_namespace_key?: string;
    /** Input type: text */
    metafield_url_key?: string;
    /** Input type: textarea */
    side_effect?: string;
    /** Input type: text */
    target_handle?: string;
    /** Input type: inline_richtext */
    title?: string;
    /** Input type: url */
    url?: string;
  };
  type: "button";
};

export type CardsArticleBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: checkbox */
    hydrate_immediately: boolean;
    /** Input type: range */
    preload_images: number;
    /** Input type: article */
    article_10?: _Article_liquid | string;
    /** Input type: article */
    article_11?: _Article_liquid | string;
    /** Input type: article */
    article_12?: _Article_liquid | string;
    /** Input type: article */
    article_1?: _Article_liquid | string;
    /** Input type: article */
    article_2?: _Article_liquid | string;
    /** Input type: article */
    article_3?: _Article_liquid | string;
    /** Input type: article */
    article_4?: _Article_liquid | string;
    /** Input type: article */
    article_5?: _Article_liquid | string;
    /** Input type: article */
    article_6?: _Article_liquid | string;
    /** Input type: article */
    article_7?: _Article_liquid | string;
    /** Input type: article */
    article_8?: _Article_liquid | string;
    /** Input type: article */
    article_9?: _Article_liquid | string;
    /** Input type: metaobject */
    article_card_class?: string;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: blog */
    blog?: _Blog_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    display_limit?: string;
    /** Input type: text */
    filter_by_tag?: string;
    /** Input type: number */
    order_offset?: number;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "cards_article";
};

export type CardsCollectionBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: checkbox */
    hydrate_immediately: boolean;
    /** Input type: range */
    preload_images: number;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: metaobject */
    collection_card_class?: string;
    /** Input type: collection_list */
    collections?: _Collection_liquid[];
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    display_limit?: string;
    /** Input type: number */
    order_offset?: number;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "cards_collection";
};

export type CardsIngredientBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: range */
    auto_rotate: number;
    /** Input type: checkbox */
    enable_mouse_dragging: boolean;
    /** Input type: checkbox */
    enable_show_more_button: boolean;
    /** Input type: select */
    infinite_scroll: "off" | "desktop" | "mobile" | "all";
    /** Input type: checkbox */
    pause_on_hover: boolean;
    /** Input type: checkbox */
    preload: boolean;
    /** Input type: checkbox */
    show_popup: boolean;
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start" | "snap-m md:[&>*]:snap-start [&>*]:snap-center";
    /** Input type: text */
    button_class?: string;
    /** Input type: inline_richtext */
    content_1_label?: string;
    /** Input type: inline_richtext */
    content_2_label?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    display_limit?: string;
    /** Input type: number */
    max_width?: number;
    /** Input type: text */
    metafield_content_1_key?: string;
    /** Input type: text */
    metafield_content_2_key?: string;
    /** Input type: text */
    metafield_description_key?: string;
    /** Input type: text */
    metafield_image_key?: string;
    /** Input type: text */
    metafield_percentage_1_key?: string;
    /** Input type: text */
    metafield_percentage_2_key?: string;
    /** Input type: text */
    metafield_product_handle_key?: string;
    /** Input type: text */
    metafield_short_description_key?: string;
    /** Input type: text */
    metafield_title_key?: string;
    /** Input type: metaobject_list */
    metaobjects?: string[];
    /** Input type: inline_richtext */
    percentage_1_label?: string;
    /** Input type: inline_richtext */
    percentage_2_label?: string;
    /** Input type: inline_richtext */
    percentages_label?: string;
    /** Input type: text */
    popup_button_class?: string;
    /** Input type: inline_richtext */
    popup_button_label?: string;
    /** Input type: inline_richtext */
    product_button_class?: string;
    /** Input type: inline_richtext */
    product_button_label?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
    /** Input type: inline_richtext */
    show_less_button_content?: string;
    /** Input type: inline_richtext */
    show_more_button_content?: string;
    /** Input type: text */
    sizes?: string;
  };
  type: "cards_ingredient";
};

export type CardsLineItemBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: checkbox */
    hydrate_immediately: boolean;
    /** Input type: range */
    preload_images: number;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: textarea */
    filter_keys?: string;
    /** Input type: textarea */
    filter_keys_include?: string;
    /** Input type: metaobject */
    line_item_card_class?: string;
    /** Input type: number */
    order_offset?: number;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "cards_line_item";
};

export type CardsProductBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: checkbox */
    addon_auto_add: boolean;
    /** Input type: checkbox */
    addon_bundle_in_cart: boolean;
    /** Input type: checkbox */
    addon_products: boolean;
    /** Input type: select */
    fallback_source: "complementary" | "related" | "recently_viewed" | "manual";
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: checkbox */
    hide_out_of_stock: boolean;
    /** Input type: checkbox */
    hydrate_immediately: boolean;
    /** Input type: range */
    preload_images: number;
    /** Input type: select */
    primary_source: "complementary" | "related" | "recently_viewed" | "manual";
    /** Input type: select */
    targeting_type: "product" | "recently_viewed_ai" | "recently_viewed_most_expensive" | "recently_viewed_least_expensive" | "cart_ai" | "cart_most_expensive" | "cart_least_expensive" | "cart_recently_added";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    display_limit?: string;
    /** Input type: collection */
    fallback_collection?: _Collection_liquid;
    /** Input type: product_list */
    fallback_products?: _Product_liquid[];
    /** Input type: number */
    order_offset?: number;
    /** Input type: metaobject */
    product_card_class?: string;
    /** Input type: product */
    target_product?: _Product_liquid;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "cards_product";
};

export type CardsTestimonialBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: checkbox */
    preload: boolean;
    /** Input type: range */
    rating: number;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    button_class?: string;
    /** Input type: inline_richtext */
    button_text?: string;
    /** Input type: url */
    button_url?: string;
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    icon?: string;
    /** Input type: image_picker */
    image?: _Image_liquid | string;
    /** Input type: inline_richtext */
    label?: string;
    /** Input type: text */
    label_class?: string;
    /** Input type: number */
    max_width?: number;
    /** Input type: text */
    sizes?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "cards_testimonial";
};

export type CardsUgcVideoBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: checkbox */
    autoplay: boolean;
    /** Input type: checkbox */
    closest_product_fallback: boolean;
    /** Input type: checkbox */
    controls: boolean;
    /** Input type: select */
    dynamic_content_type: "default" | "metafield";
    /** Input type: select */
    generate_block_presets: "never" | "always" | "manual_override";
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: checkbox */
    loop: boolean;
    /** Input type: checkbox */
    muted: boolean;
    /** Input type: checkbox */
    preload: boolean;
    /** Input type: select */
    text_alignment: "inherit" | "left" | "center" | "right";
    /** Input type: richtext */
    caption?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    caption_class?: string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: number */
    max_width?: number;
    /** Input type: text */
    metafield_caption_key?: string;
    /** Input type: text */
    metafield_namespace_key?: string;
    /** Input type: text */
    metafield_preview_image_key?: string;
    /** Input type: text */
    metafield_products_key?: string;
    /** Input type: text */
    metafield_video_key?: string;
    /** Input type: text */
    metafield_video_url_key?: string;
    /** Input type: text */
    play_icon?: string;
    /** Input type: image_picker */
    preview_image?: _Image_liquid | string;
    /** Input type: product_list */
    products?: _Product_liquid[];
    /** Input type: text */
    sizes?: string;
    /** Input type: video */
    video?: _Video_liquid;
    /** Input type: video_url */
    video_url?: `${string}youtube${string}` | `${string}vimeo${string}`;
  };
  type: "cards_ugc_video";
};

export type CardsVideoProductBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: checkbox */
    autoplay: boolean;
    /** Input type: checkbox */
    loop: boolean;
    /** Input type: checkbox */
    muted: boolean;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: image_picker */
    preview_image?: _Image_liquid | string;
    /** Input type: product */
    product?: _Product_liquid;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: video */
    video?: _Video_liquid;
    /** Input type: video_url */
    video_url?: `${string}youtube${string}` | `${string}vimeo${string}`;
  };
  type: "cards_video_product";
};

export type CollapsibleBlock = {
  blocks: GlobalThemeBlocks[];
  id: string;
  settings: {
    /** Input type: checkbox */
    auto_close_siblings: boolean;
    /** Input type: select */
    dynamic_content_type: "default" | "metafield";
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: select */
    metafield_default_state: "closed" | "open_first" | "open_all";
    /** Input type: checkbox */
    show: boolean;
    /** Input type: text */
    accordion_class?: string;
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: image_picker */
    image?: _Image_liquid | string;
    /** Input type: inline_richtext */
    label?: string;
    /** Input type: text */
    metafield_content_key?: string;
    /** Input type: text */
    metafield_image_key?: string;
    /** Input type: text */
    metafield_label_key?: string;
    /** Input type: text */
    metafield_namespace_key?: string;
  };
  type: "collapsible";
};

export type CollapsibleBlocks =
  | GlobalThemeBlocks;

export type ContainerBlock = {
  blocks: GlobalThemeBlocks[];
  id: string;
  settings: {
    /** Input type: select */
    custom_effect: "off" | "scroll_reveal" | "collapsible" | "link";
    /** Input type: select */
    generate_block_presets: "never" | "always" | "manual_override";
    /** Input type: checkbox */
    open_in_new_tab: boolean;
    /** Input type: select */
    scroll_reveal: "container" | "children";
    /** Input type: checkbox */
    show: boolean;
    /** Input type: text */
    accessibility_label?: string;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: text */
    collapsible_handle?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    element_id?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: url */
    url?: string;
  };
  type: "container";
};

export type ContainerBlocks =
  | GlobalThemeBlocks;

export type CountdownBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: range */
    auto_refresh_hours: number;
    /** Input type: range */
    duration_offset_hours: number;
    /** Input type: select */
    hide_if_expired: "none" | "section" | "container" | "block";
    /** Input type: select */
    timezone: "user" | "-12" | "-11" | "-10" | "-9" | "-8" | "-7" | "-6" | "-5" | "-4" | "-3" | "-2" | "-1" | "0" | "1" | "2" | "3" | "4" | "5" | "5.5" | "6" | "7" | "8" | "9" | "10" | "11" | "12";
    /** Input type: select */
    type: "date" | "duration_offset";
    /** Input type: inline_richtext */
    content?: string;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    end_date?: string;
    /** Input type: text */
    end_time?: string;
    /** Input type: inline_richtext */
    timer_expired_message?: string;
  };
  type: "countdown";
};

export type CustomLiquidBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: liquid */
    custom_liquid?: string;
  };
  type: "custom_liquid";
};

export type DismissableBlock = {
  blocks: never[];
  id: string;
  type: "dismissable";
};

export type DividerBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
  };
  type: "divider";
};

export type FormInputTextBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    autocomplete: "off" | "name" | "honorific-prefix" | "given-name" | "additional-name" | "family-name" | "honorific-suffix" | "nickname" | "email" | "username" | "new-password" | "current-password" | "one-time-code" | "organization-title" | "organization" | "street-address" | "address-line1" | "address-line2" | "address-line3" | "address-level4" | "address-level3" | "address-level2" | "address-level1" | "country" | "country-name" | "postal-code" | "cc-name" | "cc-given-name" | "cc-additional-name" | "cc-family-name" | "cc-number" | "cc-exp" | "cc-exp-month" | "cc-exp-year" | "cc-csc" | "cc-type" | "transaction-currency" | "transaction-amount" | "language" | "bday" | "bday-day" | "bday-month" | "bday-year" | "sex" | "tel" | "tel-country-code" | "tel-national" | "tel-area-code" | "tel-local" | "tel-extension" | "impp" | "url" | "photo";
    /** Input type: checkbox */
    required: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    default_value?: string;
    /** Input type: text */
    input_class?: string;
    /** Input type: text */
    name?: string;
    /** Input type: text */
    placeholder?: string;
    /** Input type: text */
    title?: string;
    /** Input type: text */
    type?: string;
  };
  type: "_form__input_text";
};

export type FormInputEmailBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    autocomplete: "off" | "name" | "honorific-prefix" | "given-name" | "additional-name" | "family-name" | "honorific-suffix" | "nickname" | "email" | "username" | "new-password" | "current-password" | "one-time-code" | "organization-title" | "organization" | "street-address" | "address-line1" | "address-line2" | "address-line3" | "address-level4" | "address-level3" | "address-level2" | "address-level1" | "country" | "country-name" | "postal-code" | "cc-name" | "cc-given-name" | "cc-additional-name" | "cc-family-name" | "cc-number" | "cc-exp" | "cc-exp-month" | "cc-exp-year" | "cc-csc" | "cc-type" | "transaction-currency" | "transaction-amount" | "language" | "bday" | "bday-day" | "bday-month" | "bday-year" | "sex" | "tel" | "tel-country-code" | "tel-national" | "tel-area-code" | "tel-local" | "tel-extension" | "impp" | "url" | "photo";
    /** Input type: checkbox */
    required: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    default_value?: string;
    /** Input type: text */
    input_class?: string;
    /** Input type: text */
    name?: string;
    /** Input type: text */
    placeholder?: string;
    /** Input type: text */
    title?: string;
    /** Input type: text */
    type?: string;
  };
  type: "_form__input_email";
};

export type FormInputPasswordBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    autocomplete: "off" | "name" | "honorific-prefix" | "given-name" | "additional-name" | "family-name" | "honorific-suffix" | "nickname" | "email" | "username" | "new-password" | "current-password" | "one-time-code" | "organization-title" | "organization" | "street-address" | "address-line1" | "address-line2" | "address-line3" | "address-level4" | "address-level3" | "address-level2" | "address-level1" | "country" | "country-name" | "postal-code" | "cc-name" | "cc-given-name" | "cc-additional-name" | "cc-family-name" | "cc-number" | "cc-exp" | "cc-exp-month" | "cc-exp-year" | "cc-csc" | "cc-type" | "transaction-currency" | "transaction-amount" | "language" | "bday" | "bday-day" | "bday-month" | "bday-year" | "sex" | "tel" | "tel-country-code" | "tel-national" | "tel-area-code" | "tel-local" | "tel-extension" | "impp" | "url" | "photo";
    /** Input type: checkbox */
    required: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    default_value?: string;
    /** Input type: text */
    input_class?: string;
    /** Input type: text */
    name?: string;
    /** Input type: text */
    placeholder?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_form__input_password";
};

export type FormInputButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    button_type: "submit" | "button" | "reset";
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    default_value?: string;
    /** Input type: text */
    name?: string;
    /** Input type: inline_richtext */
    title?: string;
  };
  type: "_form__input_button";
};

export type FormInputTagBlock = {
  blocks: FormInputTagBlocks[];
  id: string;
  theme_block: true;
  type: "_form__input_tag";
};

export type FormInputTagBlocks = Extract<ThemeBlocks, { type: "_form__input_tag_value" }>;

export type FormInputTagValueBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    title?: string;
  };
  type: "_form__input_tag_value";
};

export type FormInputTextareaBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    required: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    default_value?: string;
    /** Input type: number */
    limit_characters?: number;
    /** Input type: text */
    name?: string;
    /** Input type: text */
    placeholder?: string;
    /** Input type: text */
    textarea_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_form__input_textarea";
};

export type FormInputSelectBlock = {
  blocks: FormInputSelectBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    name?: string;
    /** Input type: text */
    select_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_form__input_select";
};

export type FormInputSelectBlocks = Extract<ThemeBlocks, { type: "_form__option" }>;

export type FormOptionBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    disabled: boolean;
    /** Input type: text */
    title?: string;
    /** Input type: text */
    value?: string;
  };
  type: "_form__option";
};

export type FormContainerBlock = {
  blocks: FormContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    custom_effect: "off" | "scroll_reveal" | "collapsible" | "link";
    /** Input type: select */
    generate_block_presets: "never" | "always" | "manual_override";
    /** Input type: checkbox */
    open_in_new_tab: boolean;
    /** Input type: select */
    scroll_reveal: "container" | "children";
    /** Input type: checkbox */
    show: boolean;
    /** Input type: text */
    accessibility_label?: string;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: text */
    collapsible_handle?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    element_id?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: url */
    url?: string;
  };
  type: "_form__container";
};

export type FormContainerBlocks =
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "_form__input_text" }>
  | Extract<ThemeBlocks, { type: "_form__input_email" }>
  | Extract<ThemeBlocks, { type: "_form__input_password" }>
  | Extract<ThemeBlocks, { type: "_form__input_button" }>
  | Extract<ThemeBlocks, { type: "_form__input_tag" }>
  | Extract<ThemeBlocks, { type: "_form__input_textarea" }>
  | Extract<ThemeBlocks, { type: "_form__input_select" }>
  | Extract<ThemeBlocks, { type: "_form__container" }>
  | GlobalThemeBlocks;

export type FormBlock = {
  blocks: FormBlocks[];
  id: string;
  settings: {
    /** Input type: select */
    generate_block_presets: "never" | "always" | "manual_override";
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: select */
    target_visibility: "" | "targeted" | "no_target";
    /** Input type: select */
    type: "contact" | "newsletter_signup" | "new_comment" | "sign_up" | "sign_in" | "password_activate" | "password_recover" | "password_reset" | "storefront_password";
    /** Input type: article */
    article?: _Article_liquid | string;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    target_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "form";
};

export type FormBlocks =
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "_form__input_text" }>
  | Extract<ThemeBlocks, { type: "_form__input_email" }>
  | Extract<ThemeBlocks, { type: "_form__input_password" }>
  | Extract<ThemeBlocks, { type: "_form__input_button" }>
  | Extract<ThemeBlocks, { type: "_form__input_tag" }>
  | Extract<ThemeBlocks, { type: "_form__input_textarea" }>
  | Extract<ThemeBlocks, { type: "_form__input_select" }>
  | Extract<ThemeBlocks, { type: "_form__container" }>
  | GlobalThemeBlocks;

export type HideIfEmptyBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: liquid */
    liquid_code?: string;
  };
  type: "hide_if_empty";
};

export type ImageBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: checkbox */
    preload: boolean;
    /** Input type: checkbox */
    show_overlay: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: image_picker */
    image?: _Image_liquid | string;
    /** Input type: number */
    max_width?: number;
    /** Input type: image_picker */
    mobile_image?: _Image_liquid | string;
    /** Input type: number */
    mobile_max_width?: number;
    /** Input type: color_background */
    overlay_color?: string;
    /** Input type: text */
    sizes?: string;
    /** Input type: url */
    url?: string;
  };
  type: "image";
};

export type ImageWithCaptionBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: select */
    dynamic_content_type: "default" | "metafield";
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: checkbox */
    preload: boolean;
    /** Input type: checkbox */
    show_overlay: boolean;
    /** Input type: select */
    text_alignment: "inherit" | "left" | "center" | "right";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: richtext */
    caption?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    caption_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: richtext */
    description?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    description_class?: string;
    /** Input type: text */
    element_id?: string;
    /** Input type: image_picker */
    image?: _Image_liquid | string;
    /** Input type: number */
    max_width?: number;
    /** Input type: text */
    metafield_caption_key?: string;
    /** Input type: text */
    metafield_description_key?: string;
    /** Input type: text */
    metafield_image_key?: string;
    /** Input type: text */
    metafield_namespace_key?: string;
    /** Input type: text */
    metafield_url_key?: string;
    /** Input type: color_background */
    overlay_color?: string;
    /** Input type: text */
    sizes?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: url */
    url?: string;
  };
  type: "image_with_caption";
};

export type LanguageSelectorBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    select_class?: string;
  };
  type: "language_selector";
};

export type LocationSelectorBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    select_class?: string;
  };
  type: "location_selector";
};

export type MarqueeBlock = {
  blocks: MarqueeBlocks[];
  id: string;
  settings: {
    /** Input type: select */
    animation_direction: "" | "reverse";
    /** Input type: checkbox */
    auto_pause: boolean;
    /** Input type: checkbox */
    auto_rotate: boolean;
    /** Input type: range */
    duration: number;
    /** Input type: select */
    generate_block_presets: "never" | "always" | "manual_override";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "marquee";
};

export type MarqueeBlocks =
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "image" }>
  | Extract<ThemeBlocks, { type: "button" }>
  | Extract<ThemeBlocks, { type: "image_with_caption" }>
  | GlobalThemeBlocks;

export type MenuBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: inline_richtext */
    content?: string;
    /** Input type: text */
    content_class?: string;
    /** Input type: url */
    content_url?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    link_class?: string;
    /** Input type: link_list */
    menu?: _Linklist_liquid;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "menu";
};

export type ParallaxImageBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: checkbox */
    preload: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: image_picker */
    image?: _Image_liquid | string;
    /** Input type: number */
    max_width?: number;
    /** Input type: text */
    opacity_breakpoints?: string;
    /** Input type: text */
    rotate_breakpoints?: string;
    /** Input type: text */
    scale_breakpoints?: string;
    /** Input type: text */
    sizes?: string;
    /** Input type: url */
    url?: string;
    /** Input type: text */
    x_breakpoints?: string;
    /** Input type: text */
    y_breakpoints?: string;
  };
  type: "parallax_image";
};

export type ParallaxRichtextBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: select */
    text_alignment: "inherit" | "left" | "center" | "right";
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    opacity_breakpoints?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: text */
    x_breakpoints?: string;
    /** Input type: text */
    y_breakpoints?: string;
  };
  type: "parallax_richtext";
};

export type PaymentTypesBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
  };
  type: "payment_types";
};

export type RichtextBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: select */
    text_alignment: "inherit" | "left" | "center" | "right";
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: richtext */
    title?: `<${_BlockTag}${string}</${_BlockTag}>`;
  };
  type: "richtext";
};

export type RichtextInlineBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: select */
    text_alignment: "inherit" | "left" | "center" | "right";
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: inline_richtext */
    title?: string;
  };
  type: "richtext_inline";
};

export type RichtextRotateBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: range */
    duration: number;
    /** Input type: checkbox */
    enable_rotate: boolean;
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: select */
    text_alignment: "inherit" | "left" | "center" | "right";
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    rotate_text?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: richtext */
    title?: `<${_BlockTag}${string}</${_BlockTag}>`;
  };
  type: "richtext_rotate";
};

export type ScrollPaginationBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
  };
  type: "scroll_pagination";
};

export type ScrollbarBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
  };
  type: "scrollbar";
};

export type ShareTargetBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    type: "facebook" | "twitter" | "pinterest" | "linkedin" | "email";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    description?: string;
    /** Input type: text */
    icon?: string;
    /** Input type: image_picker */
    image?: _Image_liquid | string;
    /** Input type: url */
    url?: string;
  };
  type: "_share__target";
};

export type ShareBlock = {
  blocks: ShareBlocks[];
  id: string;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
  };
  type: "share";
};

export type ShareBlocks = Extract<ThemeBlocks, { type: "_share__target" }>;

export type SlideBlock = {
  blocks: SlideBlocks[];
  id: string;
  settings: {
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: select */
    generate_block_presets: "never" | "always" | "manual_override";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: url */
    url?: string;
  };
  type: "slide";
};

export type SlideBlocks =
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "image" }>
  | Extract<ThemeBlocks, { type: "countdown" }>
  | Extract<ThemeBlocks, { type: "button" }>
  | Extract<ThemeBlocks, { type: "video" }>
  | Extract<ThemeBlocks, { type: "video_button" }>
  | Extract<ThemeBlocks, { type: "star_rating" }>
  | Extract<ThemeBlocks, { type: "container" }>
  | GlobalThemeBlocks;

export type SliderBlock = {
  blocks: GlobalThemeBlocks[];
  id: string;
  settings: {
    /** Input type: range */
    auto_rotate: number;
    /** Input type: checkbox */
    enable_mouse_dragging: boolean;
    /** Input type: checkbox */
    enable_show_more_button: boolean;
    /** Input type: select */
    generate_block_presets: "never" | "always" | "manual_override";
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: select */
    infinite_scroll: "off" | "desktop" | "mobile" | "all";
    /** Input type: checkbox */
    pause_on_hover: boolean;
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start" | "snap-m md:[&>*]:snap-start [&>*]:snap-center";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    button_class?: string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    display_limit?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
    /** Input type: inline_richtext */
    show_less_button_content?: string;
    /** Input type: inline_richtext */
    show_more_button_content?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "slider";
};

export type SliderBlocks =
  | GlobalThemeBlocks;

export type SlideshowBlock = {
  blocks: SlideshowBlocks[];
  id: string;
  settings: {
    /** Input type: range */
    auto_rotate: number;
    /** Input type: select */
    container_spacing: "px-container-xs" | "px-container-sm" | "px-container-md" | "px-container-lg" | "px-container-gutter" | "px-container-fullwidth";
    /** Input type: checkbox */
    enable_mouse_dragging: boolean;
    /** Input type: select */
    generate_block_presets: "never" | "always" | "manual_override";
    /** Input type: select */
    infinite_scroll: "off" | "desktop" | "mobile" | "all";
    /** Input type: checkbox */
    pause_on_hover: boolean;
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start" | "snap-m md:[&>*]:snap-start [&>*]:snap-center";
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
  };
  type: "slideshow";
};

export type SlideshowBlocks =
  | Extract<ThemeBlocks, { type: "slide" }>
  | GlobalThemeBlocks;

export type SocialIconsIconButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    generate_block_presets: "never" | "always" | "manual_override";
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: range */
    size: number;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    title?: string;
    /** Input type: url */
    url?: string;
  };
  type: "_social_icons__icon_button";
};

export type SocialIconsBlock = {
  blocks: SocialIconsBlocks[];
  id: string;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "social_icons";
};

export type SocialIconsBlocks = Extract<ThemeBlocks, { type: "_social_icons__icon_button" }>;

export type StarRatingBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: range */
    rating: number;
    /** Input type: number */
    count?: number;
    /** Input type: text */
    css_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: number */
    hide_zero_reviews?: number;
    /** Input type: text */
    icon?: string;
    /** Input type: color */
    icon_active_color?: _Color_liquid | string;
    /** Input type: color */
    icon_base_color?: _Color_liquid | string;
    /** Input type: product */
    product?: _Product_liquid;
    /** Input type: inline_richtext */
    reviews_heading?: string;
  };
  type: "star_rating";
};

export type TabContentBlock = {
  blocks: GlobalThemeBlocks[];
  id: string;
  settings: {
    /** Input type: select */
    generate_block_presets: "never" | "always" | "manual_override";
    /** Input type: select */
    tab_group: "0" | "1" | "2";
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hash_target?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: inline_richtext */
    label?: string;
  };
  type: "tab_content";
};

export type TabContentBlocks =
  | GlobalThemeBlocks;

export type TabNavigationBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: checkbox */
    enable_mouse_dragging: boolean;
    /** Input type: select */
    infinite_scroll: "off" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start" | "snap-m md:[&>*]:snap-start [&>*]:snap-center";
    /** Input type: select */
    tab_group: "0" | "1" | "2";
    /** Input type: checkbox */
    trigger_on_hover: boolean;
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    label?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
  };
  type: "tab_navigation";
};

export type VideoPlayButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    label?: string;
  };
  type: "_video__play_button";
};

export type VideoPauseButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    label?: string;
  };
  type: "_video__pause_button";
};

export type VideoBlock = {
  blocks: VideoBlocks[];
  id: string;
  settings: {
    /** Input type: checkbox */
    autoplay: boolean;
    /** Input type: checkbox */
    controls: boolean;
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: checkbox */
    loop: boolean;
    /** Input type: checkbox */
    muted: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: video */
    mobile_video?: _Video_liquid;
    /** Input type: video_url */
    mobile_video_url?: `${string}youtube${string}` | `${string}vimeo${string}`;
    /** Input type: image_picker */
    preview_image?: _Image_liquid | string;
    /** Input type: video */
    video?: _Video_liquid;
    /** Input type: video_url */
    video_url?: `${string}youtube${string}` | `${string}vimeo${string}`;
  };
  type: "video";
};

export type VideoBlocks =
  | Extract<ThemeBlocks, { type: "_video__play_button" }>
  | Extract<ThemeBlocks, { type: "_video__pause_button" }>;

export type VideoButtonBlock = {
  blocks: never[];
  id: string;
  settings: {
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    label?: string;
    /** Input type: video */
    video?: _Video_liquid;
    /** Input type: video_url */
    video_url?: `${string}youtube${string}` | `${string}vimeo${string}`;
  };
  type: "video_button";
};

export type CardContainerBlock = {
  blocks: CardContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_card__container";
};

export type CardContainerBlocks =
  | Extract<ThemeBlocks, { type: "_card__container" }>
  | Extract<ThemeBlocks, { type: "_card__image" }>
  | Extract<ThemeBlocks, { type: "_card__button" }>
  | Extract<ThemeBlocks, { type: "_card__text" }>
  | Extract<ThemeBlocks, { type: "_card__labels" }>;

export type CardImageBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    link_to_object: boolean;
    /** Input type: checkbox */
    show_overlay: boolean;
    /** Input type: checkbox */
    show_secondary_image: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: number */
    max_width?: number;
    /** Input type: color_background */
    overlay_color?: string;
    /** Input type: text */
    primary_image?: string;
    /** Input type: text */
    secondary_image?: string;
    /** Input type: text */
    sizes?: string;
  };
  type: "_card__image";
};

export type CardButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    accessibility_label?: string;
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    label?: string;
    /** Input type: text */
    url?: string;
  };
  type: "_card__button";
};

export type CardTextBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    link_to_object: boolean;
    /** Input type: select */
    text_alignment: "inherit" | "left" | "center" | "right";
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    css_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_card__text";
};

export type CardLabelsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    content_source?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    label_class__content?: string;
  };
  type: "_card__labels";
};

export type CardLineItemCardContainerBlock = {
  blocks: CardLineItemCardContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    generate_block_presets: "never" | "always" | "manual_override";
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions" | "no_addon_products" | "addon_products" | "with_variants" | "no_variants";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: liquid */
    custom_liquid?: string;
    /** Input type: text */
    dynamic_background_color?: string;
    /** Input type: text */
    dynamic_border_color?: string;
    /** Input type: text */
    dynamic_text_color?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_card_line_item_card__container";
};

export type CardLineItemCardContainerBlocks =
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

export type CardLineItemCardImageBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    link_to_object: boolean;
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions" | "no_addon_products" | "addon_products" | "with_variants" | "no_variants";
    /** Input type: checkbox */
    show_secondary_image: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: number */
    max_width?: number;
    /** Input type: text */
    primary_image?: string;
    /** Input type: text */
    secondary_image?: string;
    /** Input type: text */
    sizes?: string;
  };
  type: "_card_line_item_card__image";
};

export type CardLineItemCardRichtextBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: checkbox */
    link_to_product: boolean;
    /** Input type: checkbox */
    open_in_new_tab: boolean;
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions" | "no_addon_products" | "addon_products" | "with_variants" | "no_variants";
    /** Input type: select */
    text_alignment: "inherit" | "left" | "center" | "right";
    /** Input type: text */
    css_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: richtext */
    title?: `<${_BlockTag}${string}</${_BlockTag}>`;
  };
  type: "_card_line_item_card__richtext";
};

export type CardLineItemCardButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions" | "no_addon_products" | "addon_products" | "with_variants" | "no_variants";
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    label?: string;
    /** Input type: text */
    url?: string;
  };
  type: "_card_line_item_card__button";
};

export type CardLineItemCardPriceBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    currency_display: "store_default" | "amount" | "amount_no_decimals";
    /** Input type: select */
    price_calculation: "normal" | "quantity_multiplied";
    /** Input type: select */
    price_display: "" | "bundle_";
    /** Input type: checkbox */
    show_compare_as_price: boolean;
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions" | "no_addon_products" | "addon_products" | "with_variants" | "no_variants";
    /** Input type: select */
    text_alignment: "inherit" | "left" | "center" | "right";
    /** Input type: text */
    css_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    discount_css_class?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_card_line_item_card__price";
};

export type CardLineItemCardQuantitySelectorBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions" | "no_addon_products" | "addon_products" | "with_variants" | "no_variants";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    quantity_class?: string;
  };
  type: "_card_line_item_card__quantity_selector";
};

export type CardLineItemCardQuantityPickerBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions" | "no_addon_products" | "addon_products" | "with_variants" | "no_variants";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    input_class?: string;
    /** Input type: number */
    max?: number;
    /** Input type: number */
    min?: number;
  };
  type: "_card_line_item_card__quantity_picker";
};

export type CardLineItemCardRemoveButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions" | "no_addon_products" | "addon_products" | "with_variants" | "no_variants";
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    label?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_card_line_item_card__remove_button";
};

export type CardLineItemCardSubscriptionSelectorBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions" | "no_addon_products" | "addon_products" | "with_variants" | "no_variants";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    label?: string;
    /** Input type: text */
    select_class?: string;
  };
  type: "_card_line_item_card__subscription_selector";
};

export type CardLineItemCardSubscriptionButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions" | "no_addon_products" | "addon_products" | "with_variants" | "no_variants";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    label?: string;
    /** Input type: text */
    select_class?: string;
  };
  type: "_card_line_item_card__subscription_button";
};

export type CardLineItemCardPropertiesBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions" | "no_addon_products" | "addon_products" | "with_variants" | "no_variants";
    /** Input type: inline_richtext */
    content?: string;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: textarea */
    filter_keys?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_card_line_item_card__properties";
};

export type CardLineItemCardDiscountsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions" | "no_addon_products" | "addon_products" | "with_variants" | "no_variants";
    /** Input type: inline_richtext */
    content?: string;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_card_line_item_card__discounts";
};

export type CardLineItemCardAddonItemsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions" | "no_addon_products" | "addon_products" | "with_variants" | "no_variants";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: metaobject */
    line_item_card_class?: string;
    /** Input type: number */
    order_offset?: number;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_card_line_item_card__addon_items";
};

export type CardProductCardContainerBlock = {
  blocks: CardProductCardContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    generate_block_presets: "never" | "always" | "manual_override";
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions" | "no_bundle" | "bundle" | "with_variants" | "no_variants";
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
    hidden_name_backup?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_card_product_card__container";
};

export type CardProductCardContainerBlocks =
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

export type CardProductCardCollapsibleBlock = {
  blocks: CardProductCardCollapsibleBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    auto_close_siblings: boolean;
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: checkbox */
    show: boolean;
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions" | "no_bundle" | "bundle" | "with_variants" | "no_variants";
    /** Input type: text */
    accordion_class?: string;
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    label?: string;
  };
  type: "_card_product_card__collapsible";
};

export type CardProductCardCollapsibleBlocks =
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

export type CardProductCardImageBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    link_to_object: boolean;
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions" | "no_bundle" | "bundle" | "with_variants" | "no_variants";
    /** Input type: checkbox */
    show_overlay: boolean;
    /** Input type: checkbox */
    show_secondary_image: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: number */
    max_width?: number;
    /** Input type: color_background */
    overlay_color?: string;
    /** Input type: text */
    primary_image?: string;
    /** Input type: text */
    secondary_image?: string;
    /** Input type: text */
    sizes?: string;
  };
  type: "_card_product_card__image";
};

export type CardProductCardGalleryBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: radio */
    filter_images: "show_all" | "selected_variant" | "variant_images_by_order" | "variant_images_by_metafield" | "variant_images_and_unassigned" | "only_unassigned" | "first_or_selected_image";
    /** Input type: checkbox */
    scroll_to_selected_variant_image: boolean;
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions" | "no_bundle" | "bundle" | "with_variants" | "no_variants";
    /** Input type: checkbox */
    show_overlay: boolean;
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start" | "snap-m md:[&>*]:snap-start [&>*]:snap-center";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hide_image_alt?: string;
    /** Input type: number */
    max_images?: number;
    /** Input type: number */
    max_width?: number;
    /** Input type: color_background */
    overlay_color?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
    /** Input type: text */
    sizes?: string;
  };
  type: "_card_product_card__gallery";
};

export type CardProductCardRichtextBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: checkbox */
    link_to_product: boolean;
    /** Input type: checkbox */
    open_in_new_tab: boolean;
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions" | "no_bundle" | "bundle" | "with_variants" | "no_variants";
    /** Input type: select */
    text_alignment: "inherit" | "left" | "center" | "right";
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    css_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_card_product_card__richtext";
};

export type CardProductCardButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions" | "no_bundle" | "bundle" | "with_variants" | "no_variants";
    /** Input type: select */
    type: "button" | "modal_close" | "product_modal" | "toggle_collapsible";
    /** Input type: text */
    accessibility_label?: string;
    /** Input type: text */
    button_class?: string;
    /** Input type: text */
    collapsible_handle?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    label?: string;
    /** Input type: text */
    product_modal_handle?: string;
    /** Input type: text */
    url?: string;
  };
  type: "_card_product_card__button";
};

export type CardProductCardPriceBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    currency_display: "store_default" | "amount" | "amount_no_decimals";
    /** Input type: select */
    price_calculation: "normal" | "quantity_multiplied";
    /** Input type: checkbox */
    show_compare_as_price: boolean;
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions" | "no_bundle" | "bundle" | "with_variants" | "no_variants";
    /** Input type: checkbox */
    show_subscription_price: boolean;
    /** Input type: select */
    text_alignment: "inherit" | "left" | "center" | "right";
    /** Input type: text */
    css_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    discount_css_class?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_card_product_card__price";
};

export type CardProductCardLabelsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    label_type__discounts: "sale" | "percentage" | "value" | "";
    /** Input type: select */
    label_type__low_inventory: "show" | "hide";
    /** Input type: select */
    label_type__out_of_stock: "show" | "hide";
    /** Input type: select */
    label_type__preorder: "show" | "hide";
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions" | "no_bundle" | "bundle" | "with_variants" | "no_variants";
    /** Input type: checkbox */
    show_subscription_price: boolean;
    /** Input type: text */
    content_source?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    default_content__low_inventory?: string;
    /** Input type: text */
    default_content__out_of_stock?: string;
    /** Input type: text */
    default_content__preorder?: string;
    /** Input type: text */
    label_class__content?: string;
    /** Input type: text */
    label_class__discount?: string;
    /** Input type: text */
    label_class__low_inventory?: string;
    /** Input type: text */
    label_class__out_of_stock?: string;
    /** Input type: text */
    label_class__preorder?: string;
    /** Input type: number */
    low_inventory_threshold?: number;
  };
  type: "_card_product_card__labels";
};

export type CardProductCardRatingBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions" | "no_bundle" | "bundle" | "with_variants" | "no_variants";
    /** Input type: text */
    css_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: number */
    hide_zero_reviews?: number;
    /** Input type: text */
    icon?: string;
    /** Input type: color */
    icon_active_color?: _Color_liquid | string;
    /** Input type: color */
    icon_base_color?: _Color_liquid | string;
    /** Input type: inline_richtext */
    reviews_heading?: string;
  };
  type: "_card_product_card__rating";
};

export type CardProductCardAccentLineBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: range */
    height: number;
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions" | "no_bundle" | "bundle" | "with_variants" | "no_variants";
    /** Input type: select */
    style: "solid" | "dashed" | "dotted";
    /** Input type: color */
    border_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
  };
  type: "_card_product_card__accent_line";
};

export type CardProductCardCtaButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    bundle__action: "add_to_bundle" | "add_to_cart" | "quick_view" | "product_modal" | "link_to_product";
    /** Input type: checkbox */
    bundle__enable: boolean;
    /** Input type: select */
    default__action: "add_to_cart" | "quick_view" | "product_modal" | "link_to_product";
    /** Input type: select */
    pdp__action: "add_as_addon" | "add_to_cart" | "quick_view" | "product_modal" | "link_to_product";
    /** Input type: checkbox */
    pdp__allow_quantity: boolean;
    /** Input type: checkbox */
    pdp__enable: boolean;
    /** Input type: select */
    preorder__action: "add_to_cart" | "quick_view" | "product_modal" | "link_to_product";
    /** Input type: checkbox */
    preorder__enable: boolean;
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions" | "no_bundle" | "bundle" | "with_variants" | "no_variants";
    /** Input type: select */
    sold_out__action: "disabled" | "quick_view" | "product_modal" | "link_to_product" | "back_in_stock";
    /** Input type: checkbox */
    sold_out__enable: boolean;
    /** Input type: select */
    subscription__action: "add_to_cart" | "quick_view" | "product_modal" | "link_to_product";
    /** Input type: checkbox */
    subscription__enable: boolean;
    /** Input type: select */
    theme_editor_preview: "default" | "variant" | "subscription" | "bundle" | "bundle_added" | "in_pdp" | "in_pdp_added" | "out_of_stock";
    /** Input type: select */
    variant__action: "add_to_cart" | "quick_view" | "product_modal" | "link_to_product";
    /** Input type: checkbox */
    variant__enable: boolean;
    /** Input type: text */
    bundle__class?: string;
    /** Input type: inline_richtext */
    bundle__content?: string;
    /** Input type: text */
    bundle__product_modal_handle?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    default__class?: string;
    /** Input type: inline_richtext */
    default__content?: string;
    /** Input type: text */
    default__product_modal_handle?: string;
    /** Input type: text */
    pdp__class?: string;
    /** Input type: inline_richtext */
    pdp__content?: string;
    /** Input type: inline_richtext */
    pdp__content_item_added?: string;
    /** Input type: text */
    pdp__product_modal_handle?: string;
    /** Input type: text */
    pdp__quantity_class?: string;
    /** Input type: inline_richtext */
    pdp__quantity_content?: string;
    /** Input type: text */
    preorder__class?: string;
    /** Input type: inline_richtext */
    preorder__content?: string;
    /** Input type: text */
    preorder__product_modal_handle?: string;
    /** Input type: text */
    quantity_class?: string;
    /** Input type: inline_richtext */
    quantity_content?: string;
    /** Input type: text */
    sold_out__class?: string;
    /** Input type: inline_richtext */
    sold_out__content?: string;
    /** Input type: text */
    sold_out__product_modal_handle?: string;
    /** Input type: text */
    subscription__class?: string;
    /** Input type: inline_richtext */
    subscription__content?: string;
    /** Input type: text */
    subscription__product_modal_handle?: string;
    /** Input type: text */
    variant__class?: string;
    /** Input type: inline_richtext */
    variant__content?: string;
    /** Input type: text */
    variant__product_modal_handle?: string;
  };
  type: "_card_product_card__cta_button";
};

export type CardProductCardAddToCartToggleBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions" | "no_bundle" | "bundle" | "with_variants" | "no_variants";
    /** Input type: color */
    active_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    inactive_color?: _Color_liquid | string;
  };
  type: "_card_product_card__add_to_cart_toggle";
};

export type CardProductCardVariantSelectorSelectBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions" | "no_bundle" | "bundle" | "with_variants" | "no_variants";
    /** Input type: select */
    sold_out_variants: "" | "hide" | "disable";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    legend_label?: string;
    /** Input type: text */
    select_class?: string;
  };
  type: "_card_product_card__variant_selector__select";
};

export type CardProductCardVariantSelectorRadioBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    content_flow: "show_all" | "truncate" | "overflow";
    /** Input type: checkbox */
    select_on_hover: boolean;
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions" | "no_bundle" | "bundle" | "with_variants" | "no_variants";
    /** Input type: select */
    sold_out_variants: "" | "hide" | "disable";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    label_class?: string;
    /** Input type: text */
    label_metafield?: string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    legend_label?: string;
    /** Input type: text */
    radio_button_class?: string;
    /** Input type: text */
    truncate_text?: string;
  };
  type: "_card_product_card__variant_selector__radio";
};

export type CardProductCardVariantSelectorColorBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    content_flow: "show_all" | "truncate" | "overflow";
    /** Input type: select */
    fallback_source: "title" | "image" | "metafield";
    /** Input type: select */
    primary_source: "title" | "image" | "metafield";
    /** Input type: checkbox */
    select_on_hover: boolean;
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions" | "no_bundle" | "bundle" | "with_variants" | "no_variants";
    /** Input type: checkbox */
    show_tooltip: boolean;
    /** Input type: select */
    sold_out_variants: "" | "hide" | "disable";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    legend_label?: string;
    /** Input type: text */
    truncate_text?: string;
  };
  type: "_card_product_card__variant_selector__color";
};

export type CardProductCardOptionColorBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    content_flow: "show_all" | "truncate" | "overflow";
    /** Input type: select */
    fallback_source: "title" | "image" | "metafield";
    /** Input type: checkbox */
    match_exact_word: boolean;
    /** Input type: range */
    match_option_index: number;
    /** Input type: select */
    option_type: "by_name" | "by_index" | "fallback_options";
    /** Input type: select */
    primary_source: "title" | "image" | "metafield";
    /** Input type: checkbox */
    select_on_hover: boolean;
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions" | "no_bundle" | "bundle" | "with_variants" | "no_variants";
    /** Input type: checkbox */
    show_tooltip: boolean;
    /** Input type: select */
    sold_out_variants: "" | "hide" | "disable";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    match_option_titles?: string;
    /** Input type: text */
    truncate_text?: string;
  };
  type: "_card_product_card__option__color";
};

export type CardProductCardOptionRadioBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    content_flow: "show_all" | "truncate" | "overflow";
    /** Input type: checkbox */
    match_exact_word: boolean;
    /** Input type: range */
    match_option_index: number;
    /** Input type: select */
    option_type: "by_name" | "by_index" | "fallback_options";
    /** Input type: checkbox */
    select_on_hover: boolean;
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions" | "no_bundle" | "bundle" | "with_variants" | "no_variants";
    /** Input type: select */
    sold_out_variants: "" | "hide" | "disable";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    match_option_titles?: string;
    /** Input type: text */
    radio_button_class?: string;
    /** Input type: inline_richtext */
    radio_button_content?: string;
    /** Input type: text */
    truncate_text?: string;
  };
  type: "_card_product_card__option__radio";
};

export type CardProductCardOptionSelectBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    match_exact_word: boolean;
    /** Input type: range */
    match_option_index: number;
    /** Input type: select */
    option_type: "by_name" | "by_index" | "fallback_options";
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions" | "no_bundle" | "bundle" | "with_variants" | "no_variants";
    /** Input type: select */
    sold_out_variants: "" | "hide" | "disable";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    match_option_titles?: string;
    /** Input type: text */
    select_class?: string;
  };
  type: "_card_product_card__option__select";
};

export type CardProductCardAddonCheckboxBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    default_checked: boolean;
    /** Input type: text */
    checkbox_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: richtext */
    label?: `<${_BlockTag}${string}</${_BlockTag}>`;
  };
  type: "_card_product_card__addon_checkbox";
};

export type HeaderAnnouncementBarCloseButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: range */
    keep_closed_for: number;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    icon?: string;
  };
  type: "_header_announcement_bar__close_button";
};

export type HeaderNavigationBarMenuBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    open_on_hover: boolean;
    /** Input type: checkbox */
    use_link_handle: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    link_class?: string;
    /** Input type: text */
    megamenu_handle?: string;
    /** Input type: link_list */
    menu?: _Linklist_liquid;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_header_navigation_bar__menu";
};

export type HeaderNavigationBarContainerBlock = {
  blocks: HeaderNavigationBarContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    custom_effect: "off" | "scroll_reveal" | "collapsible" | "link";
    /** Input type: select */
    generate_block_presets: "never" | "always" | "manual_override";
    /** Input type: checkbox */
    open_in_new_tab: boolean;
    /** Input type: select */
    scroll_reveal: "container" | "children";
    /** Input type: checkbox */
    show: boolean;
    /** Input type: text */
    accessibility_label?: string;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: text */
    collapsible_handle?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    element_id?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: url */
    url?: string;
  };
  type: "_header_navigation_bar__container";
};

export type HeaderNavigationBarContainerBlocks =
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

export type HeaderNavigationBarBurgerMenuButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    submenu_handle?: string;
    /** Input type: url */
    url?: string;
  };
  type: "_header_navigation_bar__burger_menu_button";
};

export type HeaderNavigationBarMegamenuButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    open_on_hover: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    icon?: string;
    /** Input type: text */
    megamenu_handle?: string;
    /** Input type: text */
    submenu_handle?: string;
    /** Input type: inline_richtext */
    title?: string;
    /** Input type: text */
    title_class?: string;
    /** Input type: url */
    url?: string;
  };
  type: "_header_navigation_bar__megamenu_button";
};

export type HeaderNavigationBarSearchButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    icon?: string;
    /** Input type: text */
    input_class?: string;
    /** Input type: text */
    label?: string;
    /** Input type: text */
    placeholder?: string;
  };
  type: "_header_navigation_bar__search_button";
};

export type HeaderNavigationBarSearchButtonWithBarBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    icon?: string;
    /** Input type: text */
    input_class?: string;
    /** Input type: text */
    label?: string;
    /** Input type: text */
    placeholder?: string;
  };
  type: "_header_navigation_bar__search_button_with_bar";
};

export type HeaderNavigationBarCartButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    show_cart_quantity: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    icon?: string;
  };
  type: "_header_navigation_bar__cart_button";
};

export type HeaderNavigationBarAccountButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    icon?: string;
  };
  type: "_header_navigation_bar__account_button";
};

export type HeaderNavigationBarDynamicDisplayContainerBlock = {
  blocks: HeaderNavigationBarDynamicDisplayContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: checkbox */
    hide_if_set_paths: boolean;
    /** Input type: checkbox */
    hide_if_set_templates: boolean;
    /** Input type: checkbox */
    required_paths: boolean;
    /** Input type: checkbox */
    required_templates: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: textarea */
    match_paths?: string;
    /** Input type: textarea */
    match_templates?: string;
  };
  type: "_header_navigation_bar__dynamic_display_container";
};

export type HeaderNavigationBarDynamicDisplayContainerBlocks =
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

export type MainAccountContainerBlock = {
  blocks: MainAccountContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    custom_effect: "off" | "scroll_reveal" | "collapsible" | "link";
    /** Input type: select */
    generate_block_presets: "never" | "always" | "manual_override";
    /** Input type: checkbox */
    open_in_new_tab: boolean;
    /** Input type: select */
    scroll_reveal: "container" | "children";
    /** Input type: checkbox */
    show: boolean;
    /** Input type: text */
    accessibility_label?: string;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: text */
    collapsible_handle?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    element_id?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: url */
    url?: string;
  };
  type: "_main_account__container";
};

export type MainAccountContainerBlocks =
  | GlobalThemeBlocks
  | Extract<ThemeBlocks, { type: "_main_account__container" }>
  | Extract<ThemeBlocks, { type: "_main_account__orders_table" }>
  | Extract<ThemeBlocks, { type: "_main_account__order" }>
  | Extract<ThemeBlocks, { type: "_main_account__addresses" }>
  | Extract<ThemeBlocks, { type: "_main_account__default_address" }>
  | Extract<ThemeBlocks, { type: "_main_account__new_address_button" }>;

export type MainAccountOrdersTableBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_main_account__orders_table";
};

export type MainAccountOrderBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_main_account__order";
};

export type MainAccountAddressesBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_main_account__addresses";
};

export type MainAccountDefaultAddressBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
  };
  type: "_main_account__default_address";
};

export type MainAccountNewAddressButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    label?: string;
  };
  type: "_main_account__new_address_button";
};

export type MainArticleContainerBlock = {
  blocks: MainArticleContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    custom_effect: "off" | "scroll_reveal" | "collapsible" | "link";
    /** Input type: select */
    generate_block_presets: "never" | "always" | "manual_override";
    /** Input type: checkbox */
    open_in_new_tab: boolean;
    /** Input type: select */
    scroll_reveal: "container" | "children";
    /** Input type: checkbox */
    show: boolean;
    /** Input type: text */
    accessibility_label?: string;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: text */
    collapsible_handle?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    element_id?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: url */
    url?: string;
  };
  type: "_main_article__container";
};

export type MainArticleContainerBlocks =
  | GlobalThemeBlocks
  | Extract<ThemeBlocks, { type: "tab_navigation" }>
  | Extract<ThemeBlocks, { type: "slider" }>
  | Extract<ThemeBlocks, { type: "_main_article__container" }>
  | Extract<ThemeBlocks, { type: "_main_article__pagination" }>
  | Extract<ThemeBlocks, { type: "_main_article__comment_cards" }>;

export type MainArticlePaginationBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    next_button_content?: string;
    /** Input type: inline_richtext */
    previous_button_content?: string;
  };
  type: "_main_article__pagination";
};

export type MainArticleCommentCardsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    enable_mouse_dragging: boolean;
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: checkbox */
    hydrate_immediately: boolean;
    /** Input type: select */
    infinite_scroll: "off" | "desktop" | "mobile" | "all";
    /** Input type: range */
    pagination_size: number;
    /** Input type: select */
    pagination_style: "classic" | "manual" | "auto" | "disabled";
    /** Input type: range */
    preload_images: number;
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start" | "snap-m md:[&>*]:snap-start [&>*]:snap-center";
    /** Input type: text */
    comment_card_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    load_more_button_class?: string;
    /** Input type: inline_richtext */
    load_more_button_text?: string;
    /** Input type: text */
    pagination_class?: string;
    /** Input type: inline_richtext */
    results_count?: string;
    /** Input type: text */
    results_count_class?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
  };
  type: "_main_article__comment_cards";
};

export type MainBlogContainerBlock = {
  blocks: MainBlogContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    custom_effect: "off" | "scroll_reveal" | "collapsible" | "link";
    /** Input type: select */
    generate_block_presets: "never" | "always" | "manual_override";
    /** Input type: checkbox */
    open_in_new_tab: boolean;
    /** Input type: select */
    scroll_reveal: "container" | "children";
    /** Input type: checkbox */
    show: boolean;
    /** Input type: text */
    accessibility_label?: string;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: text */
    collapsible_handle?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    element_id?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: url */
    url?: string;
  };
  type: "_main_blog__container";
};

export type MainBlogContainerBlocks =
  | GlobalThemeBlocks
  | Extract<ThemeBlocks, { type: "_filter_tags" }>
  | Extract<ThemeBlocks, { type: "_main_blog__container" }>
  | Extract<ThemeBlocks, { type: "_main_blog__filters" }>
  | Extract<ThemeBlocks, { type: "_main_blog__article_cards" }>
  | Extract<ThemeBlocks, { type: "_main_blog__filter_button" }>
  | Extract<ThemeBlocks, { type: "_main_blog__empty_state" }>;

export type MainBlogFiltersBlock = {
  blocks: MainBlogFiltersBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    style: "checkbox" | "radio_button";
    /** Input type: text */
    accordion_class?: string;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    button_class?: string;
    /** Input type: text */
    checkbox_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    submit_button_class?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_main_blog__filters";
};

export type MainBlogFiltersBlocks = Extract<ThemeBlocks, { type: "_main_blog__applied_filters" }>;

export type MainBlogAppliedFiltersBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    button_class?: string;
    /** Input type: text */
    content?: string;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    no_filter_content?: string;
    /** Input type: text */
    no_filter_content_class?: string;
  };
  type: "_main_blog__applied_filters";
};

export type MainBlogArticleCardsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    enable_mouse_dragging: boolean;
    /** Input type: select */
    infinite_scroll: "off" | "desktop" | "mobile" | "all";
    /** Input type: range */
    pagination_size: number;
    /** Input type: select */
    pagination_style: "classic" | "manual" | "auto" | "disabled";
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start" | "snap-m md:[&>*]:snap-start [&>*]:snap-center";
    /** Input type: text */
    article_card_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    load_more_button_class?: string;
    /** Input type: inline_richtext */
    load_more_button_text?: string;
    /** Input type: text */
    pagination_class?: string;
    /** Input type: inline_richtext */
    results_count?: string;
    /** Input type: text */
    results_count_class?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
  };
  type: "_main_blog__article_cards";
};

export type MainBlogFilterButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
  };
  type: "_main_blog__filter_button";
};

export type MainBlogEmptyStateBlock = {
  blocks: GlobalThemeBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
  };
  type: "_main_blog__empty_state";
};

export type MainBlogEmptyStateBlocks = GlobalThemeBlocks;

export type MainCartCheckoutButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_conditionally: "always" | "cart_empty" | "items_added";
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    label?: string;
  };
  type: "_main_cart__checkout_button";
};

export type MainCartDiscountDetailsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    show_cart_discounts: boolean;
    /** Input type: select */
    show_conditionally: "always" | "cart_empty" | "items_added";
    /** Input type: checkbox */
    show_discount_code_discounts: boolean;
    /** Input type: checkbox */
    show_line_item_discounts: boolean;
    /** Input type: checkbox */
    show_selling_plan_discounts: boolean;
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    price_class?: string;
    /** Input type: text */
    text_class?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_main_cart__discount_details";
};

export type MainCartDiscountCodeInputBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_conditionally: "always" | "cart_empty" | "items_added";
    /** Input type: text */
    button_class?: string;
    /** Input type: inline_richtext */
    button_label?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    input_class?: string;
    /** Input type: text */
    input_label?: string;
    /** Input type: text */
    input_placeholder?: string;
  };
  type: "_main_cart__discount_code_input";
};

export type MainCartDynamicRichtextBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_conditionally: "always" | "cart_empty" | "items_added";
    /** Input type: select */
    text_alignment: "inherit" | "left" | "center" | "right";
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_main_cart__dynamic_richtext";
};

export type MainCartGiftWithPurchaseBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    allow_duplicates: boolean;
    /** Input type: checkbox */
    auto_add_to_cart: boolean;
    /** Input type: checkbox */
    auto_remove_from_cart: boolean;
    /** Input type: checkbox */
    enable_mouse_dragging: boolean;
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: checkbox */
    hide_in_cart: boolean;
    /** Input type: checkbox */
    hide_out_of_stock: boolean;
    /** Input type: select */
    infinite_scroll: "off" | "desktop" | "mobile" | "all";
    /** Input type: range */
    receives_quantity: number;
    /** Input type: select */
    show_conditionally: "always" | "cart_empty" | "items_added";
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start" | "snap-m md:[&>*]:snap-start [&>*]:snap-center";
    /** Input type: select */
    target_type: "total_price" | "item_count";
    /** Input type: text */
    accordion_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: richtext */
    legend?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: metaobject */
    product_card_class?: string;
    /** Input type: product_list */
    products?: _Product_liquid[];
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
    /** Input type: number */
    target?: number;
  };
  type: "_main_cart__gift_with_purchase";
};

export type MainCartNoteBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    checkbox_default_state: "unchecked" | "checked";
    /** Input type: checkbox */
    checkbox_enabled: boolean;
    /** Input type: select */
    dynamic_display: "show_always" | "show_checkbox_checked";
    /** Input type: select */
    show_conditionally: "always" | "cart_empty" | "items_added";
    /** Input type: text */
    checkbox_class?: string;
    /** Input type: inline_richtext */
    checkbox_label?: string;
    /** Input type: text */
    checkbox_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: number */
    limit_characters?: number;
    /** Input type: text */
    textarea_class?: string;
    /** Input type: text */
    textarea_label?: string;
    /** Input type: text */
    textarea_placeholder?: string;
  };
  type: "_main_cart__note";
};

export type MainCartProgressBarBlock = {
  blocks: MainCartProgressBarBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    incentive_type: "total_price" | "item_count";
    /** Input type: select */
    show_conditionally: "always" | "cart_empty" | "items_added";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: color */
    base_bg_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    success_bg_color?: _Color_liquid | string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_main_cart__progress_bar";
};

export type MainCartProgressBarBlocks = Extract<ThemeBlocks, { type: "_main_cart__progress_bar_target" }>;

export type MainCartProgressBarTargetBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    content_class?: string;
    /** Input type: inline_richtext */
    incentive_message?: string;
    /** Input type: inline_richtext */
    success_message?: string;
    /** Input type: number */
    target?: number;
  };
  type: "_main_cart__progress_bar_target";
};

export type MainCartProgressBarStackedBlock = {
  blocks: MainCartProgressBarStackedBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    incentive_type: "total_price" | "item_count";
    /** Input type: select */
    show_conditionally: "always" | "cart_empty" | "items_added";
    /** Input type: color */
    base_bg_color?: _Color_liquid | string;
    /** Input type: color */
    base_border_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    success_bg_color?: _Color_liquid | string;
    /** Input type: color */
    success_border_color?: _Color_liquid | string;
  };
  type: "_main_cart__progress_bar_stacked";
};

export type MainCartProgressBarStackedBlocks = Extract<ThemeBlocks, { type: "_main_cart__progress_bar_stacked_target" }>;

export type MainCartProgressBarStackedTargetBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    content_class?: string;
    /** Input type: product */
    gift_product?: _Product_liquid;
    /** Input type: image_picker */
    icon?: _Image_liquid | string;
    /** Input type: richtext */
    incentive_message?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: image_picker */
    success_icon?: _Image_liquid | string;
    /** Input type: richtext */
    success_message?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: number */
    target?: number;
  };
  type: "_main_cart__progress_bar_stacked_target";
};

export type MainCartTotalBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_conditionally: "always" | "cart_empty" | "items_added";
    /** Input type: text */
    compare_at_price_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    price_class?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_main_cart__total";
};

export type MainCartCollapsibleBlock = {
  blocks: MainCartCollapsibleBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    default_state: "show" | "hide";
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: select */
    show_conditionally: "always" | "cart_empty" | "items_added";
    /** Input type: text */
    accordion_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    label?: string;
  };
  type: "_main_cart__collapsible";
};

export type MainCartCollapsibleBlocks =
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

export type MainCartDynamicCheckoutButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_conditionally: "always" | "cart_empty" | "items_added";
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
  };
  type: "_main_cart__dynamic_checkout_button";
};

export type MainCartContainerBlock = {
  blocks: MainCartContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    custom_effect: "off" | "scroll_reveal" | "collapsible" | "link";
    /** Input type: select */
    generate_block_presets: "never" | "always" | "manual_override";
    /** Input type: checkbox */
    open_in_new_tab: boolean;
    /** Input type: select */
    scroll_reveal: "container" | "children";
    /** Input type: checkbox */
    show: boolean;
    /** Input type: select */
    show_conditionally: "always" | "cart_empty" | "items_added";
    /** Input type: text */
    accessibility_label?: string;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: text */
    collapsible_handle?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    element_id?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: url */
    url?: string;
  };
  type: "_main_cart__container";
};

export type MainCartContainerBlocks =
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

export type MainCartSubscriptionSelectorBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_conditionally: "always" | "cart_empty" | "items_added";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    label?: string;
    /** Input type: text */
    select_class?: string;
  };
  type: "_main_cart__subscription_selector";
};

export type MainCartSubscriptionButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_conditionally: "always" | "cart_empty" | "items_added";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    label?: string;
    /** Input type: text */
    select_class?: string;
  };
  type: "_main_cart__subscription_button";
};

export type MainCartLineItemBundleBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_conditionally: "always" | "cart_empty" | "items_added";
    /** Input type: select */
    text_alignment: "inherit" | "left" | "center" | "right";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    button_class?: string;
    /** Input type: inline_richtext */
    button_label?: string;
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    product_card_class?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_main_cart__line_item_bundle";
};

export type MainCollectionProductCountBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: inline_richtext */
    content?: string;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
  };
  type: "_main_collection__product_count";
};

export type MainCollectionContainerBlock = {
  blocks: MainCollectionContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    custom_effect: "off" | "scroll_reveal" | "collapsible" | "link";
    /** Input type: select */
    generate_block_presets: "never" | "always" | "manual_override";
    /** Input type: checkbox */
    open_in_new_tab: boolean;
    /** Input type: select */
    scroll_reveal: "container" | "children";
    /** Input type: checkbox */
    show: boolean;
    /** Input type: text */
    accessibility_label?: string;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: text */
    collapsible_handle?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    element_id?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: url */
    url?: string;
  };
  type: "_main_collection__container";
};

export type MainCollectionContainerBlocks =
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

export type MainCollectionCollapsibleBlock = {
  blocks: MainCollectionCollapsibleBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: checkbox */
    show: boolean;
    /** Input type: text */
    accordion_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    label?: string;
  };
  type: "_main_collection__collapsible";
};

export type MainCollectionCollapsibleBlocks =
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

export type MainCollectionFilterSidebarBlock = {
  blocks: MainCollectionFilterSidebarBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: range */
    inline_at_screens_above: number;
    /** Input type: checkbox */
    show_sidebar: boolean;
    /** Input type: checkbox */
    sticky_sidebar: boolean;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_main_collection__filter_sidebar";
};

export type MainCollectionFilterSidebarBlocks =
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

export type MainCollectionAppliedCountBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: inline_richtext */
    content?: string;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
  };
  type: "_main_collection__applied_count";
};

export type MainCollectionAppliedFiltersBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    show_only_active: boolean;
    /** Input type: text */
    button_class?: string;
    /** Input type: text */
    content?: string;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    no_filter_content?: string;
    /** Input type: text */
    no_filter_content_class?: string;
  };
  type: "_main_collection__applied_filters";
};

export type MainCollectionFiltersBlock = {
  blocks: MainCollectionFiltersBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    auto_close_siblings: boolean;
    /** Input type: checkbox */
    auto_open_active_filters: boolean;
    /** Input type: select */
    default_state: "show_first" | "show" | "hide";
    /** Input type: checkbox */
    dropdown_menu: boolean;
    /** Input type: checkbox */
    filters_show_count: boolean;
    /** Input type: checkbox */
    show_empty_entries: boolean;
    /** Input type: text */
    accordion_class?: string;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    checkbox_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    submit_button_class?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_main_collection__filters";
};

export type MainCollectionFiltersBlocks =
  | GlobalThemeBlocks
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "_main_collection__container" }>
  | Extract<ThemeBlocks, { type: "_main_collection__collapsible" }>
  | Extract<ThemeBlocks, { type: "_main_collection__applied_filters" }>
  | Extract<ThemeBlocks, { type: "_main_collection__color_override" }>
  | Extract<ThemeBlocks, { type: "_main_collection__image_override" }>
  | Extract<ThemeBlocks, { type: "_main_collection__radio_button_override" }>
  | Extract<ThemeBlocks, { type: "_main_collection__checkbox_override" }>;

export type MainCollectionColorOverrideBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    open_by_default: boolean;
    /** Input type: checkbox */
    show_empty_entries: boolean;
    /** Input type: checkbox */
    show_tooltip: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    handle?: string;
  };
  type: "_main_collection__color_override";
};

export type MainCollectionImageOverrideBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    open_by_default: boolean;
    /** Input type: checkbox */
    show_tooltip: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    handle?: string;
  };
  type: "_main_collection__image_override";
};

export type MainCollectionRadioButtonOverrideBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    filters_show_count: boolean;
    /** Input type: checkbox */
    open_by_default: boolean;
    /** Input type: checkbox */
    show_empty_entries: boolean;
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    handle?: string;
  };
  type: "_main_collection__radio_button_override";
};

export type MainCollectionCheckboxOverrideBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    filters_show_count: boolean;
    /** Input type: checkbox */
    open_by_default: boolean;
    /** Input type: checkbox */
    show_empty_entries: boolean;
    /** Input type: text */
    checkbox_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    handle?: string;
  };
  type: "_main_collection__checkbox_override";
};

export type MainCollectionSortBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    select_class?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_main_collection__sort";
};

export type MainCollectionFilterSubmitButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    button_class?: string;
    /** Input type: inline_richtext */
    button_text?: string;
    /** Input type: textarea */
    custom_css?: string;
  };
  type: "_main_collection__filter_submit_button";
};

export type MainCollectionFilterClearButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    button_class?: string;
    /** Input type: inline_richtext */
    button_text?: string;
    /** Input type: textarea */
    custom_css?: string;
  };
  type: "_main_collection__filter_clear_button";
};

export type MainCollectionFilterButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    button_class?: string;
    /** Input type: inline_richtext */
    button_text?: string;
    /** Input type: textarea */
    custom_css?: string;
  };
  type: "_main_collection__filter_button";
};

export type MainCollectionProductCardsBlock = {
  blocks: MainCollectionProductCardsBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    enable_mouse_dragging: boolean;
    /** Input type: select */
    generate_block_presets: "never" | "always" | "manual_override";
    /** Input type: checkbox */
    hydrate_immediately: boolean;
    /** Input type: select */
    infinite_scroll: "off" | "desktop" | "mobile" | "all";
    /** Input type: range */
    pagination_size: number;
    /** Input type: select */
    pagination_style: "classic" | "manual" | "auto" | "disabled";
    /** Input type: range */
    preload_images: number;
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start" | "snap-m md:[&>*]:snap-start [&>*]:snap-center";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    load_more_button_class?: string;
    /** Input type: inline_richtext */
    load_more_button_text?: string;
    /** Input type: text */
    pagination_class?: string;
    /** Input type: metaobject */
    product_card_class?: string;
    /** Input type: inline_richtext */
    results_count?: string;
    /** Input type: text */
    results_count_class?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_main_collection__product_cards";
};

export type MainCollectionProductCardsBlocks =
  | Extract<ThemeBlocks, { type: "container" }>
  | Extract<ThemeBlocks, { type: "cards_video_product" }>
  | Extract<ThemeBlocks, { type: "cards_testimonial" }>
  | Extract<ThemeBlocks, { type: "image_with_caption" }>
  | GlobalThemeBlocks;

export type MainCollectionEmptyStateBlock = {
  blocks: MainCollectionEmptyStateBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
  };
  type: "_main_collection__empty_state";
};

export type MainCollectionEmptyStateBlocks =
  | Extract<ThemeBlocks, { type: "image" }>
  | Extract<ThemeBlocks, { type: "richtext" }>;

export type MainListCollectionsContainerBlock = {
  blocks: MainListCollectionsContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    custom_effect: "off" | "scroll_reveal" | "collapsible" | "link";
    /** Input type: select */
    generate_block_presets: "never" | "always" | "manual_override";
    /** Input type: checkbox */
    open_in_new_tab: boolean;
    /** Input type: select */
    scroll_reveal: "container" | "children";
    /** Input type: checkbox */
    show: boolean;
    /** Input type: text */
    accessibility_label?: string;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: text */
    collapsible_handle?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    element_id?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: url */
    url?: string;
  };
  type: "_main_list_collections__container";
};

export type MainListCollectionsContainerBlocks =
  | Extract<ThemeBlocks, { type: "breadcrumbs" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | Extract<ThemeBlocks, { type: "_main_list_collections__container" }>
  | Extract<ThemeBlocks, { type: "_main_list_collections__collection_cards" }>
  | Extract<ThemeBlocks, { type: "_main_list_collections__empty_state" }>;

export type MainListCollectionsCollectionCardsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    enable_mouse_dragging: boolean;
    /** Input type: select */
    infinite_scroll: "off" | "desktop" | "mobile" | "all";
    /** Input type: range */
    pagination_size: number;
    /** Input type: select */
    pagination_style: "classic" | "manual" | "auto" | "disabled";
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start" | "snap-m md:[&>*]:snap-start [&>*]:snap-center";
    /** Input type: text */
    collection_card_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    load_more_button_class?: string;
    /** Input type: inline_richtext */
    load_more_button_text?: string;
    /** Input type: text */
    pagination_class?: string;
    /** Input type: inline_richtext */
    results_count?: string;
    /** Input type: text */
    results_count_class?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
  };
  type: "_main_list_collections__collection_cards";
};

export type MainListCollectionsEmptyStateBlock = {
  blocks: MainListCollectionsEmptyStateBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
  };
  type: "_main_list_collections__empty_state";
};

export type MainListCollectionsEmptyStateBlocks =
  | Extract<ThemeBlocks, { type: "image" }>
  | Extract<ThemeBlocks, { type: "richtext" }>;

export type MainProductContainerBlock = {
  blocks: MainProductContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    custom_effect: "off" | "scroll_reveal" | "collapsible" | "link";
    /** Input type: select */
    generate_block_presets: "never" | "always" | "manual_override";
    /** Input type: checkbox */
    open_in_new_tab: boolean;
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: select */
    scroll_reveal: "container" | "children";
    /** Input type: checkbox */
    show: boolean;
    /** Input type: text */
    accessibility_label?: string;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: text */
    collapsible_handle?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    element_id?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: url */
    url?: string;
  };
  type: "_main_product__container";
};

export type MainProductContainerBlocks =
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

export type MainProductCollapsibleContainerBlock = {
  blocks: MainProductCollapsibleContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: checkbox */
    show: boolean;
    /** Input type: text */
    accordion_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: image_picker */
    image?: _Image_liquid | string;
    /** Input type: inline_richtext */
    label?: string;
  };
  type: "_main_product__collapsible_container";
};

export type MainProductCollapsibleContainerBlocks =
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

export type MainProductAvailabilityBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: select */
    text_alignment: "inherit" | "left" | "center" | "right";
    /** Input type: inline_richtext */
    content_available?: string;
    /** Input type: text */
    content_class?: string;
    /** Input type: inline_richtext */
    content_sold_out?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_main_product__availability";
};

export type MainProductSelectedPlanDurationBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    css_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_main_product__selected_plan_duration";
};

export type MainProductGalleryBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    additional_view: "disabled" | "media_gallery";
    /** Input type: checkbox */
    enable_mouse_dragging: boolean;
    /** Input type: radio */
    filter_images: "show_all" | "selected_variant" | "variant_images_by_order" | "variant_images_by_metafield" | "variant_images_and_unassigned" | "only_unassigned" | "first_or_selected_image";
    /** Input type: select */
    generate_block_presets: "never" | "always" | "manual_override";
    /** Input type: select */
    infinite_scroll: "off" | "desktop" | "mobile" | "all";
    /** Input type: range */
    preload_images: number;
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: checkbox */
    scroll_to_selected_variant_image: boolean;
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start" | "snap-m md:[&>*]:snap-start [&>*]:snap-center";
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    hide_image_alt?: string;
    /** Input type: number */
    max_width?: number;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
    /** Input type: text */
    sizes?: string;
  };
  type: "_main_product__gallery";
};

export type MainProductThumbnailsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    enable_mouse_dragging: boolean;
    /** Input type: select */
    generate_block_presets: "never" | "always" | "manual_override";
    /** Input type: select */
    infinite_scroll: "off" | "desktop" | "mobile" | "all";
    /** Input type: range */
    preload_images: number;
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: checkbox */
    select_variant_on_click: boolean;
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start" | "snap-m md:[&>*]:snap-start [&>*]:snap-center";
    /** Input type: radio */
    thumbnail_filter_images: "show_all" | "show_all_variants" | "selected_variant" | "variant_images_by_order" | "variant_images_by_metafield" | "variant_images_and_unassigned" | "only_unassigned";
    /** Input type: text */
    category_name?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    hide_image_alt?: string;
    /** Input type: number */
    max_width?: number;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
    /** Input type: text */
    sizes?: string;
  };
  type: "_main_product__thumbnails";
};

export type MainProductPriceBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    currency_display: "store_default" | "amount" | "amount_no_decimals";
    /** Input type: select */
    price_calculation: "normal" | "quantity_multiplied";
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: checkbox */
    show_compare_as_price: boolean;
    /** Input type: checkbox */
    show_total_price: boolean;
    /** Input type: text */
    css_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    discount_css_class?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_main_product__price";
};

export type MainProductRatingBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: text */
    css_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: number */
    hide_zero_reviews?: number;
    /** Input type: text */
    icon?: string;
    /** Input type: color */
    icon_active_color?: _Color_liquid | string;
    /** Input type: color */
    icon_base_color?: _Color_liquid | string;
    /** Input type: inline_richtext */
    reviews_heading?: string;
    /** Input type: url */
    url?: string;
  };
  type: "_main_product__rating";
};

export type MainProductQuantitySelectorBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    label?: string;
    /** Input type: text */
    label_class?: string;
    /** Input type: text */
    quantity_class?: string;
  };
  type: "_main_product__quantity_selector";
};

export type MainProductCustomQuantitySelectorBlock = {
  blocks: MainProductCustomQuantitySelectorBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
  };
  type: "_main_product__custom_quantity_selector";
};

export type MainProductCustomQuantitySelectorBlocks = Extract<ThemeBlocks, { type: "_main_product__custom_quantity" }>;

export type MainProductCustomQuantityBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: range */
    discount: number;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    icon?: string;
    /** Input type: image_picker */
    image?: _Image_liquid | string;
    /** Input type: text */
    label_class?: string;
    /** Input type: text */
    label_content?: string;
    /** Input type: number */
    quantity?: number;
    /** Input type: text */
    radio_button_class?: string;
    /** Input type: text */
    title?: string;
  };
  type: "_main_product__custom_quantity";
};

export type MainProductAddToCartButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    enable_back_in_stock_notifications: boolean;
    /** Input type: checkbox */
    quantity_price: boolean;
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: text */
    add_to_cart_class?: string;
    /** Input type: inline_richtext */
    add_to_cart_content?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    out_of_stock_class?: string;
    /** Input type: inline_richtext */
    out_of_stock_content?: string;
    /** Input type: text */
    preorder_class?: string;
    /** Input type: inline_richtext */
    preorder_content?: string;
  };
  type: "_main_product__add_to_cart_button";
};

export type MainProductCtaButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    default__action: "add_to_cart" | "quick_view" | "product_modal" | "link_to_product";
    /** Input type: select */
    preorder__action: "add_to_cart" | "quick_view" | "product_modal" | "link_to_product";
    /** Input type: checkbox */
    preorder__enable: boolean;
    /** Input type: select */
    show_conditionally: "always" | "with_subscriptions" | "no_subscriptions" | "no_bundle" | "bundle" | "with_variants" | "no_variants";
    /** Input type: select */
    sold_out__action: "disabled" | "quick_view" | "product_modal" | "link_to_product" | "back_in_stock";
    /** Input type: checkbox */
    sold_out__enable: boolean;
    /** Input type: select */
    subscription__action: "add_to_cart" | "quick_view" | "product_modal" | "link_to_product";
    /** Input type: checkbox */
    subscription__enable: boolean;
    /** Input type: select */
    theme_editor_preview: "default" | "variant" | "subscription" | "bundle" | "bundle_added" | "in_pdp" | "in_pdp_added" | "out_of_stock";
    /** Input type: select */
    variant__action: "add_to_cart" | "quick_view" | "product_modal" | "link_to_product";
    /** Input type: checkbox */
    variant__enable: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    default__class?: string;
    /** Input type: inline_richtext */
    default__content?: string;
    /** Input type: text */
    default__product_modal_handle?: string;
    /** Input type: text */
    preorder__class?: string;
    /** Input type: inline_richtext */
    preorder__content?: string;
    /** Input type: text */
    preorder__product_modal_handle?: string;
    /** Input type: text */
    sold_out__class?: string;
    /** Input type: inline_richtext */
    sold_out__content?: string;
    /** Input type: text */
    sold_out__product_modal_handle?: string;
    /** Input type: text */
    subscription__class?: string;
    /** Input type: inline_richtext */
    subscription__content?: string;
    /** Input type: text */
    subscription__product_modal_handle?: string;
    /** Input type: text */
    variant__class?: string;
    /** Input type: inline_richtext */
    variant__content?: string;
    /** Input type: text */
    variant__product_modal_handle?: string;
  };
  type: "_main_product__cta_button";
};

export type MainProductDescriptionBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    auto_close_siblings: boolean;
    /** Input type: select */
    open_accordions: "" | "first" | "all";
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: select */
    style: "plain" | "accordion_plain" | "accordion_h1";
    /** Input type: text */
    accordion_class?: string;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    label?: string;
  };
  type: "_main_product__description";
};

export type MainProductOptionColorBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    content_flow: "show_all" | "truncate" | "overflow";
    /** Input type: select */
    fallback_source: "title" | "image" | "metafield";
    /** Input type: checkbox */
    match_exact_word: boolean;
    /** Input type: range */
    match_option_index: number;
    /** Input type: select */
    option_type: "by_name" | "by_index" | "fallback_options";
    /** Input type: select */
    primary_source: "title" | "image" | "metafield";
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: checkbox */
    select_on_hover: boolean;
    /** Input type: checkbox */
    show_tooltip: boolean;
    /** Input type: select */
    sold_out_variants: "" | "hide" | "disable";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    match_option_titles?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
  };
  type: "_main_product__option__color";
};

export type MainProductOptionColorWCaptionBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    content_flow: "show_all" | "truncate" | "overflow";
    /** Input type: select */
    fallback_source: "title" | "image" | "metafield";
    /** Input type: checkbox */
    match_exact_word: boolean;
    /** Input type: range */
    match_option_index: number;
    /** Input type: select */
    option_type: "by_name" | "by_index" | "fallback_options";
    /** Input type: select */
    primary_source: "title" | "image" | "metafield";
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: checkbox */
    show_tooltip: boolean;
    /** Input type: select */
    sold_out_variants: "" | "hide" | "disable";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: inline_richtext */
    caption?: string;
    /** Input type: text */
    caption_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    match_option_titles?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_main_product__option__color_w_caption";
};

export type MainProductOptionRadioBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    content_flow: "show_all" | "truncate" | "overflow";
    /** Input type: checkbox */
    match_exact_word: boolean;
    /** Input type: range */
    match_option_index: number;
    /** Input type: select */
    option_type: "by_name" | "by_index" | "fallback_options";
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: checkbox */
    select_on_hover: boolean;
    /** Input type: select */
    sold_out_variants: "" | "hide" | "disable";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    match_option_titles?: string;
    /** Input type: text */
    radio_button_class?: string;
    /** Input type: inline_richtext */
    radio_button_content?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
  };
  type: "_main_product__option__radio";
};

export type MainProductOptionRadioDetailedBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    content_flow: "show_all" | "truncate" | "overflow";
    /** Input type: checkbox */
    match_exact_word: boolean;
    /** Input type: range */
    match_option_index: number;
    /** Input type: select */
    option_type: "by_name" | "by_index" | "fallback_options";
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: select */
    sold_out_variants: "" | "hide" | "disable";
    /** Input type: select */
    sort_options_by: "off" | "title-ascending" | "title-descending";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: color_background */
    background_gradient?: string;
    /** Input type: color */
    border_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: richtext */
    dynamic_content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    dynamic_content_class?: string;
    /** Input type: inline_richtext */
    footnote_caption?: string;
    /** Input type: text */
    footnote_caption_class?: string;
    /** Input type: color */
    hover_background_color?: _Color_liquid | string;
    /** Input type: color */
    hover_text_color?: _Color_liquid | string;
    /** Input type: text */
    image_metafield?: string;
    /** Input type: text */
    label_class?: string;
    /** Input type: text */
    label_metafield?: string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    match_option_titles?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_main_product__option__radio_detailed";
};

export type MainProductOptionSelectBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    fallback_source: "title" | "image" | "metafield" | "disabled";
    /** Input type: checkbox */
    match_exact_word: boolean;
    /** Input type: range */
    match_option_index: number;
    /** Input type: select */
    option_type: "by_name" | "by_index" | "fallback_options";
    /** Input type: select */
    primary_source: "title" | "image" | "metafield" | "disabled";
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    match_option_titles?: string;
    /** Input type: text */
    select_class?: string;
  };
  type: "_main_product__option__select";
};

export type MainProductVariantSelectorColorBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    content_flow: "show_all" | "truncate" | "overflow";
    /** Input type: select */
    fallback_source: "title" | "image" | "metafield";
    /** Input type: select */
    primary_source: "title" | "image" | "metafield";
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: checkbox */
    select_on_hover: boolean;
    /** Input type: checkbox */
    show_tooltip: boolean;
    /** Input type: select */
    sold_out_variants: "" | "hide" | "disable";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    hover_border_color?: _Color_liquid | string;
    /** Input type: color */
    hover_outline_color?: _Color_liquid | string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    legend_label?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
  };
  type: "_main_product__variant_selector__color";
};

export type MainProductVariantSelectorRadioBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    content_flow: "show_all" | "truncate" | "overflow";
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: checkbox */
    select_on_hover: boolean;
    /** Input type: select */
    sold_out_variants: "" | "hide" | "disable";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    label_class?: string;
    /** Input type: text */
    label_metafield?: string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    legend_label?: string;
    /** Input type: text */
    radio_button_class?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
  };
  type: "_main_product__variant_selector__radio";
};

export type MainProductVariantSelectorSelectBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    sold_out_variants: "" | "hide" | "disable";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    legend_label?: string;
    /** Input type: text */
    select_class?: string;
  };
  type: "_main_product__variant_selector__select";
};

export type MainProductSiblingColorBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    content_flow: "show_all" | "truncate" | "overflow";
    /** Input type: checkbox */
    dangerously_check_markets: boolean;
    /** Input type: select */
    fallback_source: "title" | "image" | "metafield";
    /** Input type: select */
    primary_source: "title" | "image" | "metafield";
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: checkbox */
    show_tooltip: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    hover_border_color?: _Color_liquid | string;
    /** Input type: color */
    hover_outline_color?: _Color_liquid | string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    legend_label?: string;
    /** Input type: text */
    metafield?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
  };
  type: "_main_product__sibling__color";
};

export type MainProductSiblingRadioBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    content_flow: "show_all" | "truncate" | "overflow";
    /** Input type: checkbox */
    dangerously_check_markets: boolean;
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    label_class?: string;
    /** Input type: text */
    label_metafield?: string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    legend_label?: string;
    /** Input type: text */
    metafield?: string;
    /** Input type: text */
    radio_button_class?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
  };
  type: "_main_product__sibling__radio";
};

export type MainProductSiblingSelectBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    dangerously_check_markets: boolean;
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    legend_label?: string;
    /** Input type: text */
    metafield?: string;
    /** Input type: text */
    select_class?: string;
  };
  type: "_main_product__sibling__select";
};

export type MainProductSiblingColorSelectBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    dangerously_check_markets: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    legend_label?: string;
    /** Input type: text */
    metafield?: string;
    /** Input type: text */
    select_class?: string;
  };
  type: "_main_product__sibling__color_select";
};

export type MainProductSiblingScentSidebarBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    dangerously_check_markets: boolean;
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    legend?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: text */
    legend_label?: string;
    /** Input type: text */
    metafield?: string;
    /** Input type: text */
    select_class?: string;
  };
  type: "_main_product__sibling__scent_sidebar";
};

export type MainProductSubscribeButtonSelectBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    default_selection: "one_time" | "subscription";
    /** Input type: select */
    layout_order: "order-1" | "-order-1";
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: inline_richtext */
    legend_label?: string;
    /** Input type: inline_richtext */
    one_time_content?: string;
    /** Input type: text */
    select_class?: string;
    /** Input type: inline_richtext */
    subscription_content?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_main_product__subscribe__button_select";
};

export type MainProductSubscribeButtonCardBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    currency_display: "store_default" | "amount" | "amount_no_decimals";
    /** Input type: select */
    default_selection: "subscription" | "one_time";
    /** Input type: range */
    discount_percentage_override: number;
    /** Input type: select */
    price_calculation: "normal" | "quantity_multiplied" | "no_discount";
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    label_class?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: inline_richtext */
    legend_label?: string;
    /** Input type: inline_richtext */
    one_time_content?: string;
    /** Input type: text */
    price_class?: string;
    /** Input type: text */
    select_class?: string;
    /** Input type: inline_richtext */
    subscription_content?: string;
    /** Input type: richtext */
    subscription_highlights?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_main_product__subscribe__button_card";
};

export type MainProductSubscribeButtonSwitchBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    currency_display: "store_default" | "amount" | "amount_no_decimals";
    /** Input type: select */
    default_selection: "subscription" | "one_time";
    /** Input type: range */
    discount_percentage_override: number;
    /** Input type: select */
    layout_order: "-order-1" | "order-1";
    /** Input type: select */
    price_calculation: "normal" | "quantity_multiplied" | "no_discount";
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    label_class?: string;
    /** Input type: text */
    legend_class?: string;
    /** Input type: inline_richtext */
    legend_label?: string;
    /** Input type: inline_richtext */
    one_time_content?: string;
    /** Input type: richtext */
    one_time_highlights?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    price_class?: string;
    /** Input type: text */
    savings_highlight_class?: string;
    /** Input type: text */
    select_class?: string;
    /** Input type: inline_richtext */
    subscription_content?: string;
    /** Input type: richtext */
    subscription_highlights?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_main_product__subscribe__button_switch";
};

export type MainProductSubscribeToggleCardBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    currency_display: "store_default" | "amount" | "amount_no_decimals";
    /** Input type: select */
    default_selection: "subscription" | "one_time";
    /** Input type: select */
    price_calculation: "normal" | "quantity_multiplied" | "no_discount";
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    compare_at_price_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: richtext */
    fourteen_sticks_subscription_highlights?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: image_picker */
    gwp_image?: _Image_liquid | string;
    /** Input type: richtext */
    highlights?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    highlights_class?: string;
    /** Input type: inline_richtext */
    label?: string;
    /** Input type: text */
    label_class?: string;
    /** Input type: richtext */
    no_subscription_highlights?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    price_class?: string;
    /** Input type: richtext */
    promotional_text?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: inline_richtext */
    savings_label?: string;
    /** Input type: text */
    savings_label_class?: string;
    /** Input type: text */
    select_class?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_main_product__subscribe__toggle_card";
};

export type MainProductPaymentTermsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
  };
  type: "_main_product__payment_terms";
};

export type MainProductDynamicBuyButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    out_of_stock_content?: string;
  };
  type: "_main_product__dynamic_buy_button";
};

export type MainProductDynamicTextBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    link_to_product: boolean;
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: select */
    text_alignment: "inherit" | "left" | "center" | "right";
    /** Input type: text */
    css_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: richtext */
    title?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    type_richtext_metafield?: string;
  };
  type: "_main_product__dynamic_text";
};

export type MainProductImageBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    link_to_object: boolean;
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: checkbox */
    show_overlay: boolean;
    /** Input type: checkbox */
    show_secondary_image: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: number */
    max_width?: number;
    /** Input type: color_background */
    overlay_color?: string;
    /** Input type: text */
    primary_image?: string;
    /** Input type: text */
    secondary_image?: string;
    /** Input type: text */
    sizes?: string;
  };
  type: "_main_product__image";
};

export type MainProductLabelsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    label_type__discounts: "sale" | "percentage" | "value" | "";
    /** Input type: select */
    label_type__low_inventory: "show" | "hide";
    /** Input type: select */
    label_type__out_of_stock: "show" | "hide";
    /** Input type: select */
    label_type__preorder: "show" | "hide";
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: text */
    content_source?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    default_content__low_inventory?: string;
    /** Input type: text */
    default_content__out_of_stock?: string;
    /** Input type: text */
    default_content__preorder?: string;
    /** Input type: text */
    label_class__content?: string;
    /** Input type: text */
    label_class__discount?: string;
    /** Input type: text */
    label_class__low_inventory?: string;
    /** Input type: text */
    label_class__out_of_stock?: string;
    /** Input type: text */
    label_class__preorder?: string;
    /** Input type: number */
    low_inventory_threshold?: number;
  };
  type: "_main_product__labels";
};

export type MainProductGiftCardRecipientBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    enable_message: boolean;
    /** Input type: checkbox */
    enable_name: boolean;
    /** Input type: checkbox */
    enable_send_on: boolean;
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: text */
    checkbox_class?: string;
    /** Input type: inline_richtext */
    checkbox_label?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    email_class?: string;
    /** Input type: text */
    email_label?: string;
    /** Input type: text */
    email_placeholder?: string;
    /** Input type: text */
    message_class?: string;
    /** Input type: text */
    message_label?: string;
    /** Input type: text */
    message_placeholder?: string;
    /** Input type: text */
    name_class?: string;
    /** Input type: text */
    name_label?: string;
    /** Input type: text */
    name_placeholder?: string;
    /** Input type: text */
    send_on_class?: string;
    /** Input type: text */
    send_on_label?: string;
  };
  type: "_main_product__gift_card_recipient";
};

export type MainProductBundleVariantsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  type: "_main_product__bundle_variants";
};

export type MainProductGalleryButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    dynamic_content_type: "default" | "metafield";
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: text */
    accessibility_label?: string;
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: number */
    slide?: number;
    /** Input type: text */
    slide_dynamic?: string;
    /** Input type: inline_richtext */
    title?: string;
  };
  type: "_main_product__gallery_button";
};

export type MainProductRebuyPopupBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    rebuy_widget_id?: string;
  };
  type: "_main_product__rebuy_popup";
};

export type MainProductAddonsAtcButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    quick_view_visibility: "default" | "hidden" | "mobile_header" | "quick_view_only";
    /** Input type: text */
    button_class?: string;
    /** Input type: inline_richtext */
    content?: string;
    /** Input type: textarea */
    custom_css?: string;
  };
  type: "_main_product__addons_atc_button";
};

export type MainSearchProductCountBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_search_conditionally: "always" | "no_search_query" | "with_search_query" | "search_empty" | "items_found";
    /** Input type: inline_richtext */
    content?: string;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    plural_name?: string;
    /** Input type: text */
    singular_name?: string;
  };
  type: "_main_search__product_count";
};

export type MainSearchDynamicTextBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_search_conditionally: "always" | "no_search_query" | "with_search_query" | "search_empty" | "items_found";
    /** Input type: select */
    text_alignment: "inherit" | "left" | "center" | "right";
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_main_search__dynamic_text";
};

export type MainSearchContainerBlock = {
  blocks: MainSearchContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    custom_effect: "off" | "scroll_reveal" | "collapsible" | "link";
    /** Input type: select */
    generate_block_presets: "never" | "always" | "manual_override";
    /** Input type: checkbox */
    open_in_new_tab: boolean;
    /** Input type: select */
    scroll_reveal: "container" | "children";
    /** Input type: checkbox */
    show: boolean;
    /** Input type: select */
    show_search_conditionally: "always" | "no_search_query" | "with_search_query" | "search_empty" | "items_found";
    /** Input type: text */
    accessibility_label?: string;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: text */
    collapsible_handle?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    element_id?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: url */
    url?: string;
  };
  type: "_main_search__container";
};

export type MainSearchContainerBlocks =
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

export type MainSearchCollapsibleBlock = {
  blocks: MainSearchCollapsibleBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: checkbox */
    show: boolean;
    /** Input type: select */
    show_search_conditionally: "always" | "no_search_query" | "with_search_query" | "search_empty" | "items_found";
    /** Input type: text */
    accordion_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    label?: string;
  };
  type: "_main_search__collapsible";
};

export type MainSearchCollapsibleBlocks =
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

export type MainSearchFilterSidebarBlock = {
  blocks: MainSearchFilterSidebarBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: range */
    inline_at_screens_above: number;
    /** Input type: checkbox */
    show_sidebar: boolean;
    /** Input type: checkbox */
    sticky_sidebar: boolean;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_main_search__filter_sidebar";
};

export type MainSearchFilterSidebarBlocks =
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

export type MainSearchAppliedFiltersBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    show_only_active: boolean;
    /** Input type: text */
    button_class?: string;
    /** Input type: text */
    content?: string;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    no_filter_content?: string;
    /** Input type: text */
    no_filter_content_class?: string;
  };
  type: "_main_search__applied_filters";
};

export type MainSearchFiltersBlock = {
  blocks: MainSearchFiltersBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    auto_close_siblings: boolean;
    /** Input type: checkbox */
    auto_open_active_filters: boolean;
    /** Input type: select */
    default_state: "show_first" | "show" | "hide";
    /** Input type: checkbox */
    dropdown_menu: boolean;
    /** Input type: checkbox */
    filters_show_count: boolean;
    /** Input type: checkbox */
    show_empty_entries: boolean;
    /** Input type: select */
    show_search_conditionally: "always" | "no_search_query" | "with_search_query" | "search_empty" | "items_found";
    /** Input type: text */
    accordion_class?: string;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    checkbox_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    submit_button_class?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_main_search__filters";
};

export type MainSearchFiltersBlocks =
  | Extract<ThemeBlocks, { type: "richtext" }>
  | GlobalThemeBlocks
  | Extract<ThemeBlocks, { type: "_main_search__container" }>
  | Extract<ThemeBlocks, { type: "_main_search__collapsible" }>
  | Extract<ThemeBlocks, { type: "_main_search__search_input" }>
  | Extract<ThemeBlocks, { type: "_main_search__applied_filters" }>
  | Extract<ThemeBlocks, { type: "_main_search__color_override" }>
  | Extract<ThemeBlocks, { type: "_main_search__image_override" }>
  | Extract<ThemeBlocks, { type: "_main_search__radio_button_override" }>
  | Extract<ThemeBlocks, { type: "_main_search__checkbox_override" }>
  | Extract<ThemeBlocks, { type: "_main_search__search_type_filter" }>;

export type MainSearchColorOverrideBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    open_by_default: boolean;
    /** Input type: checkbox */
    show_empty_entries: boolean;
    /** Input type: checkbox */
    show_tooltip: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    handle?: string;
  };
  type: "_main_search__color_override";
};

export type MainSearchImageOverrideBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    open_by_default: boolean;
    /** Input type: checkbox */
    show_tooltip: boolean;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    handle?: string;
  };
  type: "_main_search__image_override";
};

export type MainSearchRadioButtonOverrideBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    filters_show_count: boolean;
    /** Input type: checkbox */
    open_by_default: boolean;
    /** Input type: checkbox */
    show_empty_entries: boolean;
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    handle?: string;
  };
  type: "_main_search__radio_button_override";
};

export type MainSearchCheckboxOverrideBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    filters_show_count: boolean;
    /** Input type: checkbox */
    open_by_default: boolean;
    /** Input type: checkbox */
    show_empty_entries: boolean;
    /** Input type: text */
    checkbox_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    handle?: string;
  };
  type: "_main_search__checkbox_override";
};

export type MainSearchSearchTypeFilterBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    default_state: "show" | "hide";
    /** Input type: checkbox */
    show_article: boolean;
    /** Input type: checkbox */
    show_page: boolean;
    /** Input type: checkbox */
    show_product: boolean;
    /** Input type: select */
    show_search_conditionally: "always" | "no_search_query" | "with_search_query" | "search_empty" | "items_found";
    /** Input type: select */
    style: "checkbox" | "radio_button";
    /** Input type: text */
    accordion_class?: string;
    /** Input type: text */
    checkbox_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    label?: string;
    /** Input type: text */
    radio_button_class?: string;
  };
  type: "_main_search__search_type_filter";
};

export type MainSearchSortBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_search_conditionally: "always" | "no_search_query" | "with_search_query" | "search_empty" | "items_found";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    select_class?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_main_search__sort";
};

export type MainSearchFilterSubmitButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    button_class?: string;
    /** Input type: inline_richtext */
    button_text?: string;
    /** Input type: textarea */
    custom_css?: string;
  };
  type: "_main_search__filter_submit_button";
};

export type MainSearchFilterClearButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    button_class?: string;
    /** Input type: inline_richtext */
    button_text?: string;
    /** Input type: textarea */
    custom_css?: string;
  };
  type: "_main_search__filter_clear_button";
};

export type MainSearchFilterButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    button_class?: string;
    /** Input type: inline_richtext */
    button_text?: string;
    /** Input type: textarea */
    custom_css?: string;
  };
  type: "_main_search__filter_button";
};

export type MainSearchMixedCardsBlock = {
  blocks: MainSearchMixedCardsBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    enable_mouse_dragging: boolean;
    /** Input type: select */
    generate_block_presets: "never" | "always" | "manual_override";
    /** Input type: select */
    infinite_scroll: "off" | "desktop" | "mobile" | "all";
    /** Input type: range */
    pagination_size: number;
    /** Input type: select */
    pagination_style: "classic" | "manual" | "auto" | "disabled";
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start" | "snap-m md:[&>*]:snap-start [&>*]:snap-center";
    /** Input type: text */
    article_card_class?: string;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: text */
    collection_card_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: text */
    load_more_button_class?: string;
    /** Input type: inline_richtext */
    load_more_button_text?: string;
    /** Input type: text */
    page_card_class?: string;
    /** Input type: text */
    pagination_class?: string;
    /** Input type: metaobject */
    product_card_class?: string;
    /** Input type: inline_richtext */
    results_count?: string;
    /** Input type: text */
    results_count_class?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_main_search__mixed_cards";
};

export type MainSearchMixedCardsBlocks =
  | Extract<ThemeBlocks, { type: "container" }>
  | Extract<ThemeBlocks, { type: "cards_video_product" }>
  | Extract<ThemeBlocks, { type: "cards_testimonial" }>
  | Extract<ThemeBlocks, { type: "image_with_caption" }>
  | GlobalThemeBlocks;

export type MainSearchEmptyStateBlock = {
  blocks: MainSearchEmptyStateBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_search_conditionally: "always" | "no_search_query" | "with_search_query" | "search_empty" | "items_found";
    /** Input type: textarea */
    custom_css?: string;
  };
  type: "_main_search__empty_state";
};

export type MainSearchEmptyStateBlocks =
  | Extract<ThemeBlocks, { type: "image" }>
  | Extract<ThemeBlocks, { type: "richtext" }>;

export type MainSearchSearchInputBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    input_class?: string;
    /** Input type: text */
    label?: string;
    /** Input type: text */
    placeholder?: string;
    /** Input type: inline_richtext */
    prefix?: string;
    /** Input type: inline_richtext */
    suffix?: string;
  };
  type: "_main_search__search_input";
};

export type ModalQuickViewCloseButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    close_icon?: string;
    /** Input type: textarea */
    custom_css?: string;
  };
  type: "_modal_quick_view__close_button";
};

export type ModalQuickViewViewButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    content?: string;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
  };
  type: "_modal_quick_view__view_button";
};

export type ModalSearchDynamicTextBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_search_conditionally: "always" | "no_search_query" | "with_search_query" | "search_empty" | "items_found";
    /** Input type: select */
    text_alignment: "inherit" | "left" | "center" | "right";
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_modal_search__dynamic_text";
};

export type ModalSearchStaticSearchSuggestionBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_search_conditionally: "always" | "no_search_query" | "with_search_query" | "search_empty" | "items_found";
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: inline_richtext */
    label?: string;
  };
  type: "_modal_search__static_search_suggestion";
};

export type ModalSearchDynamicSearchSuggestionsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_search_conditionally: "always" | "no_search_query" | "with_search_query" | "search_empty" | "items_found";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    button_class?: string;
    /** Input type: inline_richtext */
    content?: string;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_modal_search__dynamic_search_suggestions";
};

export type ModalSearchProductResultCardsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    enable_mouse_dragging: boolean;
    /** Input type: select */
    infinite_scroll: "off" | "desktop" | "mobile" | "all";
    /** Input type: select */
    show_search_conditionally: "always" | "no_search_query" | "with_search_query" | "search_empty" | "items_found";
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start" | "snap-m md:[&>*]:snap-start [&>*]:snap-center";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: metaobject */
    product_card_class?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
  };
  type: "_modal_search__product_result_cards";
};

export type ModalSearchCollectionResultCardsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    enable_mouse_dragging: boolean;
    /** Input type: select */
    infinite_scroll: "off" | "desktop" | "mobile" | "all";
    /** Input type: select */
    show_search_conditionally: "always" | "no_search_query" | "with_search_query" | "search_empty" | "items_found";
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start" | "snap-m md:[&>*]:snap-start [&>*]:snap-center";
    /** Input type: metaobject */
    collection_card_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
  };
  type: "_modal_search__collection_result_cards";
};

export type ModalSearchPageResultCardsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    enable_mouse_dragging: boolean;
    /** Input type: select */
    infinite_scroll: "off" | "desktop" | "mobile" | "all";
    /** Input type: select */
    show_search_conditionally: "always" | "no_search_query" | "with_search_query" | "search_empty" | "items_found";
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start" | "snap-m md:[&>*]:snap-start [&>*]:snap-center";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: metaobject */
    page_card_class?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
  };
  type: "_modal_search__page_result_cards";
};

export type ModalSearchArticleResultCardsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    enable_mouse_dragging: boolean;
    /** Input type: select */
    infinite_scroll: "off" | "desktop" | "mobile" | "all";
    /** Input type: select */
    show_search_conditionally: "always" | "no_search_query" | "with_search_query" | "search_empty" | "items_found";
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start" | "snap-m md:[&>*]:snap-start [&>*]:snap-center";
    /** Input type: metaobject */
    article_card_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
  };
  type: "_modal_search__article_result_cards";
};

export type ModalSearchSearchInputBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    input_class?: string;
    /** Input type: text */
    label?: string;
    /** Input type: text */
    placeholder?: string;
  };
  type: "_modal_search__search_input";
};

export type ModalSearchContainerBlock = {
  blocks: ModalSearchContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    custom_effect: "off" | "scroll_reveal" | "collapsible" | "link";
    /** Input type: select */
    generate_block_presets: "never" | "always" | "manual_override";
    /** Input type: checkbox */
    open_in_new_tab: boolean;
    /** Input type: select */
    scroll_reveal: "container" | "children";
    /** Input type: checkbox */
    show: boolean;
    /** Input type: select */
    show_search_conditionally: "always" | "no_search_query" | "with_search_query" | "search_empty" | "items_found";
    /** Input type: text */
    accessibility_label?: string;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: text */
    collapsible_handle?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    element_id?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: url */
    url?: string;
  };
  type: "_modal_search__container";
};

export type ModalSearchContainerBlocks =
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

export type ModalSearchLoadingOverlayBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_modal_search__loading_overlay";
};

export type BundleDynamicRichtextBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    show_conditionally: "always" | "target_not_reached" | "target_reached" | "active_discount" | "no_active_discount";
    /** Input type: select */
    text_alignment: "inherit" | "left" | "center" | "right";
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    css_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_bundle__dynamic_richtext";
};

export type BundleContainerBlock = {
  blocks: BundleContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    custom_effect: "off" | "scroll_reveal" | "collapsible" | "link";
    /** Input type: select */
    generate_block_presets: "never" | "always" | "manual_override";
    /** Input type: checkbox */
    open_in_new_tab: boolean;
    /** Input type: select */
    scroll_reveal: "container" | "children";
    /** Input type: checkbox */
    show: boolean;
    /** Input type: text */
    accessibility_label?: string;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: text */
    collapsible_handle?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    element_id?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: url */
    url?: string;
  };
  type: "_bundle__container";
};

export type BundleContainerBlocks =
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

export type BundleAddedProductsBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    autofill: boolean;
    /** Input type: checkbox */
    enable_mouse_dragging: boolean;
    /** Input type: range */
    minimum_items: number;
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start" | "snap-m md:[&>*]:snap-start [&>*]:snap-center";
    /** Input type: text */
    add_icon?: string;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: richtext */
    heading?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    heading_class?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_bundle__added_products";
};

export type BundleAddButtonBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    action: "add_to_cart" | "checkout";
    /** Input type: checkbox */
    allow_incomplete_bundles: boolean;
    /** Input type: text */
    button_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    incomplete_button_class?: string;
    /** Input type: inline_richtext */
    incomplete_label?: string;
    /** Input type: inline_richtext */
    label?: string;
    /** Input type: text */
    some_complete_button_class?: string;
    /** Input type: inline_richtext */
    some_complete_label?: string;
  };
  type: "_bundle__add_button";
};

export type BundleBundleSelectorBlock = {
  blocks: BundleBundleSelectorBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    type: "auto" | "manual";
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    discount_label?: string;
    /** Input type: inline_richtext */
    price_content?: string;
    /** Input type: text */
    select_class?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_bundle__bundle_selector";
};

export type BundleBundleSelectorBlocks = Extract<ThemeBlocks, { type: "_bundle__bundle_target" }>;

export type BundleBundleTargetBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: range */
    discount_percentage: number;
    /** Input type: number */
    discount_amount?: number;
    /** Input type: text */
    label?: string;
    /** Input type: inline_richtext */
    select_label?: string;
    /** Input type: number */
    target?: number;
  };
  type: "_bundle__bundle_target";
};

export type BundleWithTabsTabItemsBlock = {
  blocks: BundleWithTabsTabItemsBlocks[];
  id: string;
  theme_block: true;
  type: "_bundle_with_tabs__tab_items";
};

export type BundleWithTabsTabItemsBlocks = Extract<ThemeBlocks, { type: "_bundle_with_tabs__bundle_tab" }>;

export type BundleWithTabsBundleTabBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: text */
    category_1_class?: string;
    /** Input type: richtext */
    category_1_heading?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: product_list */
    category_1_products?: _Product_liquid[];
    /** Input type: text */
    category_2_class?: string;
    /** Input type: richtext */
    category_2_heading?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: product_list */
    category_2_products?: _Product_liquid[];
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: image_picker */
    image?: _Image_liquid | string;
    /** Input type: product */
    primary_product?: _Product_liquid;
    /** Input type: text */
    quantity_class?: string;
    /** Input type: text */
    tab_name?: string;
  };
  type: "_bundle_with_tabs__bundle_tab";
};

export type ColorWheelDynamicRichtextBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    text_alignment: "inherit" | "left" | "center" | "right";
    /** Input type: richtext */
    content?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    content_class?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_color_wheel__dynamic_richtext";
};

export type ColorWheelColorPickerBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: image_picker */
    image?: _Image_liquid | string;
  };
  type: "_color_wheel__color_picker";
};

export type ColorWheelContainerBlock = {
  blocks: ColorWheelContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    custom_effect: "off" | "scroll_reveal" | "collapsible" | "link";
    /** Input type: select */
    generate_block_presets: "never" | "always" | "manual_override";
    /** Input type: checkbox */
    open_in_new_tab: boolean;
    /** Input type: select */
    scroll_reveal: "container" | "children";
    /** Input type: checkbox */
    show: boolean;
    /** Input type: text */
    accessibility_label?: string;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: text */
    collapsible_handle?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    element_id?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: url */
    url?: string;
  };
  type: "_color_wheel__container";
};

export type ColorWheelContainerBlocks =
  | Extract<ThemeBlocks, { type: "_color_wheel__dynamic_richtext" }>
  | Extract<ThemeBlocks, { type: "scrollbar" }>
  | Extract<ThemeBlocks, { type: "_color_wheel__color_picker" }>
  | Extract<ThemeBlocks, { type: "_color_wheel__container" }>
  | Extract<ThemeBlocks, { type: "_color_wheel__product_cards" }>;

export type ColorWheelProductCardsBlock = {
  blocks: ColorWheelProductCardsBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    enable_mouse_dragging: boolean;
    /** Input type: select */
    infinite_scroll: "off" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_overflow_container: "" | "desktop" | "mobile" | "all";
    /** Input type: select */
    slider_scroll_snap: "" | "snap-mandatory snap-to-slide" | "snap-mandatory [&>*]:snap-start" | "snap-m md:[&>*]:snap-start [&>*]:snap-center";
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    scroll_pagination_class?: string;
    /** Input type: text */
    scrollbar_class?: string;
  };
  type: "_color_wheel__product_cards";
};

export type ColorWheelProductCardsBlocks = Extract<ThemeBlocks, { type: "_color_wheel__color_collection" }>;

export type ColorWheelColorCollectionBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: range */
    end_angle: number;
    /** Input type: checkbox */
    hide_out_of_stock: boolean;
    /** Input type: checkbox */
    hydrate_immediately: boolean;
    /** Input type: range */
    limit: number;
    /** Input type: checkbox */
    preload: boolean;
    /** Input type: range */
    preload_images: number;
    /** Input type: range */
    start_angle: number;
    /** Input type: collection */
    collection?: _Collection_liquid;
    /** Input type: metaobject */
    product_card_class?: string;
  };
  type: "_color_wheel__color_collection";
};

export type FooterInternationalStoreSelectBlock = {
  blocks: never[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    label?: string;
    /** Input type: link_list */
    menu?: _Linklist_liquid;
    /** Input type: text */
    select_class?: string;
  };
  type: "_footer__international_store_select";
};

export type FooterContainerBlock = {
  blocks: FooterContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    custom_effect: "off" | "scroll_reveal" | "collapsible" | "link";
    /** Input type: select */
    generate_block_presets: "never" | "always" | "manual_override";
    /** Input type: checkbox */
    open_in_new_tab: boolean;
    /** Input type: select */
    scroll_reveal: "container" | "children";
    /** Input type: checkbox */
    show: boolean;
    /** Input type: text */
    accessibility_label?: string;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: text */
    collapsible_handle?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    element_id?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: url */
    url?: string;
  };
  type: "_footer__container";
};

export type FooterContainerBlocks =
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

export type HotspotsCanvasBlock = {
  blocks: HotspotsCanvasBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: checkbox */
    preload: boolean;
    /** Input type: checkbox */
    show_overlay: boolean;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: image_picker */
    image?: _Image_liquid | string;
    /** Input type: number */
    max_width?: number;
    /** Input type: image_picker */
    mobile_image?: _Image_liquid | string;
    /** Input type: number */
    mobile_max_width?: number;
    /** Input type: color_background */
    overlay_color?: string;
    /** Input type: text */
    sizes?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
  };
  type: "_hotspots__canvas";
};

export type HotspotsCanvasBlocks = Extract<ThemeBlocks, { type: "_hotspots__hotspot" }>;

export type HotspotsHotspotBlock = {
  blocks: HotspotsHotspotBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    dynamic_content_type: "default" | "metafield" | "target_element";
    /** Input type: select */
    hide_if_empty: "none" | "section" | "container" | "block";
    /** Input type: select */
    icon_style: "plus" | "icon_plain" | "icon_rotating" | "none";
    /** Input type: range */
    left: number;
    /** Input type: select */
    preferred_content_alignment: "left" | "right";
    /** Input type: checkbox */
    preload: boolean;
    /** Input type: select */
    text_alignment: "inherit" | "left" | "center" | "right";
    /** Input type: range */
    top: number;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: color */
    button_background_color?: _Color_liquid | string;
    /** Input type: textarea */
    button_custom_css?: string;
    /** Input type: color */
    button_text_color?: _Color_liquid | string;
    /** Input type: richtext */
    caption?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    caption_class?: string;
    /** Input type: text */
    closed_icon?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: richtext */
    description?: `<${_BlockTag}${string}</${_BlockTag}>`;
    /** Input type: text */
    description_class?: string;
    /** Input type: image_picker */
    image?: _Image_liquid | string;
    /** Input type: number */
    max_width?: number;
    /** Input type: text */
    metafield_caption_key?: string;
    /** Input type: text */
    metafield_description_key?: string;
    /** Input type: text */
    metafield_image_key?: string;
    /** Input type: text */
    metafield_left_key?: string;
    /** Input type: text */
    metafield_namespace_key?: string;
    /** Input type: text */
    metafield_top_key?: string;
    /** Input type: text */
    metafield_url_key?: string;
    /** Input type: text */
    open_icon?: string;
    /** Input type: text */
    sizes?: string;
    /** Input type: text */
    target_element_id?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: url */
    url?: string;
  };
  type: "_hotspots__hotspot";
};

export type HotspotsHotspotBlocks =
  | Extract<ThemeBlocks, { type: "image_with_caption" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | GlobalThemeBlocks;

export type HotspotsContainerBlock = {
  blocks: HotspotsContainerBlocks[];
  id: string;
  theme_block: true;
  settings: {
    /** Input type: select */
    custom_effect: "off" | "scroll_reveal" | "collapsible" | "link";
    /** Input type: select */
    generate_block_presets: "never" | "always" | "manual_override";
    /** Input type: checkbox */
    open_in_new_tab: boolean;
    /** Input type: select */
    scroll_reveal: "container" | "children";
    /** Input type: checkbox */
    show: boolean;
    /** Input type: text */
    accessibility_label?: string;
    /** Input type: color */
    background_color?: _Color_liquid | string;
    /** Input type: text */
    category_name?: string;
    /** Input type: text */
    collapsible_handle?: string;
    /** Input type: textarea */
    custom_css?: string;
    /** Input type: text */
    element_id?: string;
    /** Input type: text */
    hidden_name_backup?: string;
    /** Input type: color */
    text_color?: _Color_liquid | string;
    /** Input type: url */
    url?: string;
  };
  type: "_hotspots__container";
};

export type HotspotsContainerBlocks =
  | Extract<ThemeBlocks, { type: "image_with_caption" }>
  | Extract<ThemeBlocks, { type: "richtext" }>
  | GlobalThemeBlocks
  | Extract<ThemeBlocks, { type: "_hotspots__canvas" }>
  | Extract<ThemeBlocks, { type: "_hotspots__container" }>;

export type ThemeBlocks =
  | FilterTagsBlock
  | BreadcrumbsBlock
  | ButtonBlock
  | CardsArticleBlock
  | CardsCollectionBlock
  | CardsIngredientBlock
  | CardsLineItemBlock
  | CardsProductBlock
  | CardsTestimonialBlock
  | CardsUgcVideoBlock
  | CardsVideoProductBlock
  | CollapsibleBlock
  | ContainerBlock
  | CountdownBlock
  | CustomLiquidBlock
  | DismissableBlock
  | DividerBlock
  | FormInputTextBlock
  | FormInputEmailBlock
  | FormInputPasswordBlock
  | FormInputButtonBlock
  | FormInputTagBlock
  | FormInputTagValueBlock
  | FormInputTextareaBlock
  | FormInputSelectBlock
  | FormOptionBlock
  | FormContainerBlock
  | FormBlock
  | HideIfEmptyBlock
  | ImageBlock
  | ImageWithCaptionBlock
  | LanguageSelectorBlock
  | LocationSelectorBlock
  | MarqueeBlock
  | MenuBlock
  | ParallaxImageBlock
  | ParallaxRichtextBlock
  | PaymentTypesBlock
  | RichtextBlock
  | RichtextInlineBlock
  | RichtextRotateBlock
  | ScrollPaginationBlock
  | ScrollbarBlock
  | ShareTargetBlock
  | ShareBlock
  | SlideBlock
  | SliderBlock
  | SlideshowBlock
  | SocialIconsIconButtonBlock
  | SocialIconsBlock
  | StarRatingBlock
  | TabContentBlock
  | TabNavigationBlock
  | VideoPlayButtonBlock
  | VideoPauseButtonBlock
  | VideoBlock
  | VideoButtonBlock
  | CardContainerBlock
  | CardImageBlock
  | CardButtonBlock
  | CardTextBlock
  | CardLabelsBlock
  | CardLineItemCardContainerBlock
  | CardLineItemCardImageBlock
  | CardLineItemCardRichtextBlock
  | CardLineItemCardButtonBlock
  | CardLineItemCardPriceBlock
  | CardLineItemCardQuantitySelectorBlock
  | CardLineItemCardQuantityPickerBlock
  | CardLineItemCardRemoveButtonBlock
  | CardLineItemCardSubscriptionSelectorBlock
  | CardLineItemCardSubscriptionButtonBlock
  | CardLineItemCardPropertiesBlock
  | CardLineItemCardDiscountsBlock
  | CardLineItemCardAddonItemsBlock
  | CardProductCardContainerBlock
  | CardProductCardCollapsibleBlock
  | CardProductCardImageBlock
  | CardProductCardGalleryBlock
  | CardProductCardRichtextBlock
  | CardProductCardButtonBlock
  | CardProductCardPriceBlock
  | CardProductCardLabelsBlock
  | CardProductCardRatingBlock
  | CardProductCardAccentLineBlock
  | CardProductCardCtaButtonBlock
  | CardProductCardAddToCartToggleBlock
  | CardProductCardVariantSelectorSelectBlock
  | CardProductCardVariantSelectorRadioBlock
  | CardProductCardVariantSelectorColorBlock
  | CardProductCardOptionColorBlock
  | CardProductCardOptionRadioBlock
  | CardProductCardOptionSelectBlock
  | CardProductCardAddonCheckboxBlock
  | HeaderAnnouncementBarCloseButtonBlock
  | HeaderNavigationBarMenuBlock
  | HeaderNavigationBarContainerBlock
  | HeaderNavigationBarBurgerMenuButtonBlock
  | HeaderNavigationBarMegamenuButtonBlock
  | HeaderNavigationBarSearchButtonBlock
  | HeaderNavigationBarSearchButtonWithBarBlock
  | HeaderNavigationBarCartButtonBlock
  | HeaderNavigationBarAccountButtonBlock
  | HeaderNavigationBarDynamicDisplayContainerBlock
  | MainAccountContainerBlock
  | MainAccountOrdersTableBlock
  | MainAccountOrderBlock
  | MainAccountAddressesBlock
  | MainAccountDefaultAddressBlock
  | MainAccountNewAddressButtonBlock
  | MainArticleContainerBlock
  | MainArticlePaginationBlock
  | MainArticleCommentCardsBlock
  | MainBlogContainerBlock
  | MainBlogFiltersBlock
  | MainBlogAppliedFiltersBlock
  | MainBlogArticleCardsBlock
  | MainBlogFilterButtonBlock
  | MainBlogEmptyStateBlock
  | MainCartCheckoutButtonBlock
  | MainCartDiscountDetailsBlock
  | MainCartDiscountCodeInputBlock
  | MainCartDynamicRichtextBlock
  | MainCartGiftWithPurchaseBlock
  | MainCartNoteBlock
  | MainCartProgressBarBlock
  | MainCartProgressBarTargetBlock
  | MainCartProgressBarStackedBlock
  | MainCartProgressBarStackedTargetBlock
  | MainCartTotalBlock
  | MainCartCollapsibleBlock
  | MainCartDynamicCheckoutButtonBlock
  | MainCartContainerBlock
  | MainCartSubscriptionSelectorBlock
  | MainCartSubscriptionButtonBlock
  | MainCartLineItemBundleBlock
  | MainCollectionProductCountBlock
  | MainCollectionContainerBlock
  | MainCollectionCollapsibleBlock
  | MainCollectionFilterSidebarBlock
  | MainCollectionAppliedCountBlock
  | MainCollectionAppliedFiltersBlock
  | MainCollectionFiltersBlock
  | MainCollectionColorOverrideBlock
  | MainCollectionImageOverrideBlock
  | MainCollectionRadioButtonOverrideBlock
  | MainCollectionCheckboxOverrideBlock
  | MainCollectionSortBlock
  | MainCollectionFilterSubmitButtonBlock
  | MainCollectionFilterClearButtonBlock
  | MainCollectionFilterButtonBlock
  | MainCollectionProductCardsBlock
  | MainCollectionEmptyStateBlock
  | MainListCollectionsContainerBlock
  | MainListCollectionsCollectionCardsBlock
  | MainListCollectionsEmptyStateBlock
  | MainProductContainerBlock
  | MainProductCollapsibleContainerBlock
  | MainProductAvailabilityBlock
  | MainProductSelectedPlanDurationBlock
  | MainProductGalleryBlock
  | MainProductThumbnailsBlock
  | MainProductPriceBlock
  | MainProductRatingBlock
  | MainProductQuantitySelectorBlock
  | MainProductCustomQuantitySelectorBlock
  | MainProductCustomQuantityBlock
  | MainProductAddToCartButtonBlock
  | MainProductCtaButtonBlock
  | MainProductDescriptionBlock
  | MainProductOptionColorBlock
  | MainProductOptionColorWCaptionBlock
  | MainProductOptionRadioBlock
  | MainProductOptionRadioDetailedBlock
  | MainProductOptionSelectBlock
  | MainProductVariantSelectorColorBlock
  | MainProductVariantSelectorRadioBlock
  | MainProductVariantSelectorSelectBlock
  | MainProductSiblingColorBlock
  | MainProductSiblingRadioBlock
  | MainProductSiblingSelectBlock
  | MainProductSiblingColorSelectBlock
  | MainProductSiblingScentSidebarBlock
  | MainProductSubscribeButtonSelectBlock
  | MainProductSubscribeButtonCardBlock
  | MainProductSubscribeButtonSwitchBlock
  | MainProductSubscribeToggleCardBlock
  | MainProductPaymentTermsBlock
  | MainProductDynamicBuyButtonBlock
  | MainProductDynamicTextBlock
  | MainProductImageBlock
  | MainProductLabelsBlock
  | MainProductGiftCardRecipientBlock
  | MainProductBundleVariantsBlock
  | MainProductGalleryButtonBlock
  | MainProductRebuyPopupBlock
  | MainProductAddonsAtcButtonBlock
  | MainSearchProductCountBlock
  | MainSearchDynamicTextBlock
  | MainSearchContainerBlock
  | MainSearchCollapsibleBlock
  | MainSearchFilterSidebarBlock
  | MainSearchAppliedFiltersBlock
  | MainSearchFiltersBlock
  | MainSearchColorOverrideBlock
  | MainSearchImageOverrideBlock
  | MainSearchRadioButtonOverrideBlock
  | MainSearchCheckboxOverrideBlock
  | MainSearchSearchTypeFilterBlock
  | MainSearchSortBlock
  | MainSearchFilterSubmitButtonBlock
  | MainSearchFilterClearButtonBlock
  | MainSearchFilterButtonBlock
  | MainSearchMixedCardsBlock
  | MainSearchEmptyStateBlock
  | MainSearchSearchInputBlock
  | ModalQuickViewCloseButtonBlock
  | ModalQuickViewViewButtonBlock
  | ModalSearchDynamicTextBlock
  | ModalSearchStaticSearchSuggestionBlock
  | ModalSearchDynamicSearchSuggestionsBlock
  | ModalSearchProductResultCardsBlock
  | ModalSearchCollectionResultCardsBlock
  | ModalSearchPageResultCardsBlock
  | ModalSearchArticleResultCardsBlock
  | ModalSearchSearchInputBlock
  | ModalSearchContainerBlock
  | ModalSearchLoadingOverlayBlock
  | BundleDynamicRichtextBlock
  | BundleContainerBlock
  | BundleAddedProductsBlock
  | BundleAddButtonBlock
  | BundleBundleSelectorBlock
  | BundleBundleTargetBlock
  | BundleWithTabsTabItemsBlock
  | BundleWithTabsBundleTabBlock
  | ColorWheelDynamicRichtextBlock
  | ColorWheelColorPickerBlock
  | ColorWheelContainerBlock
  | ColorWheelProductCardsBlock
  | ColorWheelColorCollectionBlock
  | FooterInternationalStoreSelectBlock
  | FooterContainerBlock
  | HotspotsCanvasBlock
  | HotspotsHotspotBlock
  | HotspotsContainerBlock;

export type GlobalThemeBlocks =
  | BreadcrumbsBlock
  | ButtonBlock
  | CardsArticleBlock
  | CardsCollectionBlock
  | CardsIngredientBlock
  | CardsLineItemBlock
  | CardsProductBlock
  | CardsTestimonialBlock
  | CardsUgcVideoBlock
  | CardsVideoProductBlock
  | CollapsibleBlock
  | ContainerBlock
  | CountdownBlock
  | CustomLiquidBlock
  | DismissableBlock
  | DividerBlock
  | FormBlock
  | HideIfEmptyBlock
  | ImageBlock
  | ImageWithCaptionBlock
  | LanguageSelectorBlock
  | LocationSelectorBlock
  | MarqueeBlock
  | MenuBlock
  | ParallaxImageBlock
  | ParallaxRichtextBlock
  | PaymentTypesBlock
  | RichtextBlock
  | RichtextInlineBlock
  | RichtextRotateBlock
  | ScrollPaginationBlock
  | ScrollbarBlock
  | ShareBlock
  | SlideBlock
  | SliderBlock
  | SlideshowBlock
  | SocialIconsBlock
  | StarRatingBlock
  | TabContentBlock
  | TabNavigationBlock
  | VideoBlock
  | VideoButtonBlock;