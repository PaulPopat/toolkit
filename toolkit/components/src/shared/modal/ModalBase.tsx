import { IsString, IsOneOf, IsType } from "@toolkit/safe-type";
import { CssModel } from "css/CssModel";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { Slot, SlotToggle } from "utils/slot";
import { UseInert } from "utils/UseFocusable";
import { WebComponent } from "WebComponent";

const Size = IsOneOf("sm", "md", "lg");

export const ModalBase =
  (css: ($: any, open: boolean, size: IsType<typeof Size>) => CssModel): WebComponent =>
  ({ self, use_css, use_aria, use_prop, use_event }) => {
    const [hash, set_hash] = useState(window.location.hash);
    const trigger = use_prop("hash", IsString);
    const open = hash === "#" + trigger;
    const title_colour = use_prop("title", IsString, "contrast");

    use_css(
      ($, size, title_colour, body_colour, open): CssModel => ({
        ...css($, open, size),
        ":host": {
          display: "block",
          position: "fixed",
          top: "0",
          left: "0",
          bottom: "0",
          right: "0",
          pointer_events: open ? "auto" : "none",
          z_index: $.z_index.modal,
          opacity: open ? "1" : "0",
          transition: ["opacity", $.animation_speed.slow].join(" "),
        },
        ".modal::backdrop": {
          position: "absolute",
          top: "0",
          left: "0",
          bottom: "0",
          right: "0",
          background: $.background_colour.highlight,
          opacity: $.overlay.opacity,
        },
        ".title, .body": {
          padding_top: $.padding.body.y.top,
          padding_bottom: $.padding.body.y.bottom,
          padding_left: $.padding.body.x.left,
          padding_right: $.padding.body.x.right,
          font_family: $.font_family.p,
          font_size: $.font_size.p,
          font_weight: $.font_weight.p,
          text_decoration: $.text_decoration.p,
        },
        ".title": {
          display: "flex",
          align_items: "center",
          justify_content: "space-between",
          background: $.background_colour[title_colour],
          color: $.foreground_colour[title_colour],
          border_bottom_width: $.border_width.body,
          border_bottom_style: $.border_style.body,
          border_bottom_color: $.border_colour.body,
        },
        ".body": {
          background: $.background_colour[body_colour],
          color: $.foreground_colour[body_colour],
          overflow: "auto",
          flex: 1,
        },
        ".close-button": {
          position: "absolute",
          top: $.padding.body.y.top,
          right: $.padding.body.x.right,
        },
        "l-icon": { cursor: "pointer " },
      }),
      [use_prop("size", Size, "md"), title_colour, use_prop("body", IsString, "feature"), open] as const
    );

    use_aria("role", "section");
    UseInert(self, !open);
    use_event("hashchange", () => set_hash(window.location.hash), [], window);

    const dialog_ref = useRef<HTMLDialogElement | null>(null);

    useEffect(() => {
      if (open) dialog_ref.current?.showModal();
      else dialog_ref.current?.close();
    }, [open]);

    const on_click = useCallback(
      (e: Event) => {
        if (e.target !== dialog_ref.current) return;
        window.location.hash = "";
      },
      [dialog_ref]
    );

    return (
      <>
        <dialog class="modal" ref={dialog_ref} onClick={on_click}>
          <SlotToggle tag="div" class="title">
            <Slot name="title" />
          </SlotToggle>
          <div class="body">
            <slot />
          </div>
          <a class="close-button" href="#">
            <l-icon name="close-large" colour={title_colour} tag="p" text />
          </a>
        </dialog>
      </>
    );
  };
