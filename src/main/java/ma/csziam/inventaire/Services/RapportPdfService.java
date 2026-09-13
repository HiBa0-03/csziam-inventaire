package ma.csziam.inventaire.Services;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.lowagie.text.pdf.draw.LineSeparator;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;

@Service
public class RapportPdfService {

    // COULEURS
    private static final Color BLEU_CSZIAM = new Color(31, 78, 121);
    private static final Color BLEU_CLAIR = new Color(221, 235, 247);
    private static final Color GRIS_FONCE = new Color(70, 70, 70);
    private static final Color GRIS_CLAIR = new Color(230, 230, 230);
    private static final Color BLANC = Color.WHITE;


    public byte[] genererPdf(String rapport) {

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        Document document = new Document(
                PageSize.A4,
                50,
                50,
                70,
                60
        );

        try {

            PdfWriter writer = PdfWriter.getInstance(
                    document,
                    outputStream
            );

            // Header + Footer + pagination
            writer.setPageEvent(new HeaderFooterPageEvent());

            document.open();
            // POLICES
            Font titreFont = new Font(
                    Font.HELVETICA,
                    24,
                    Font.BOLD,
                    BLEU_CSZIAM
            );

            Font sousTitreFont = new Font(
                    Font.HELVETICA,
                    14,
                    Font.NORMAL,
                    GRIS_FONCE
            );

            Font sectionFont = new Font(
                    Font.HELVETICA,
                    15,
                    Font.BOLD,
                    BLEU_CSZIAM
            );

            Font texteFont = new Font(
                    Font.HELVETICA,
                    10.5f,
                    Font.NORMAL,
                    GRIS_FONCE
            );

            Font grasFont = new Font(
                    Font.HELVETICA,
                    10.5f,
                    Font.BOLD,
                    GRIS_FONCE
            );

            Font petitFont = new Font(
                    Font.HELVETICA,
                    9,
                    Font.NORMAL,
                    GRIS_FONCE
            );


            // EXTRAIRE L'ANNÉE DU RAPPORT
            String annee = extraireAnnee(rapport);


            // PAGE DE GARDE
            document.add(new Paragraph(" "));
            document.add(new Paragraph(" "));
            document.add(new Paragraph(" "));


            // LOGO
            try {

                ClassPathResource resource =
                        new ClassPathResource("static/INRH-logo.jpg");

                if (resource.exists()) {

                    InputStream inputStream =
                            resource.getInputStream();

                    byte[] logoBytes =
                            inputStream.readAllBytes();

                    Image logo =
                            Image.getInstance(logoBytes);

                    logo.scaleToFit(150, 150);
                    logo.setAlignment(Element.ALIGN_CENTER);

                    document.add(logo);

                    document.add(new Paragraph(" "));
                }

            } catch (Exception e) {

            }


            // CENTRE CSZIAM

            Paragraph centre = new Paragraph(
                    "CENTRE CSZIAM",
                    titreFont
            );

            centre.setAlignment(Element.ALIGN_CENTER);
            centre.setSpacingBefore(15);
            centre.setSpacingAfter(15);

            document.add(centre);


            // RAPPORT D'INVENTAIRE

            Paragraph rapportTitre = new Paragraph(
                    "RAPPORT D'INVENTAIRE",
                    titreFont
            );

            rapportTitre.setAlignment(Element.ALIGN_CENTER);
            rapportTitre.setSpacingAfter(12);

            document.add(rapportTitre);


            // ANNÉE DYNAMIQUE

            Paragraph anneeParagraph = new Paragraph(
                    "Année " + annee,
                    sousTitreFont
            );

            anneeParagraph.setAlignment(Element.ALIGN_CENTER);
            anneeParagraph.setSpacingAfter(35);

            document.add(anneeParagraph);


            // DESCRIPTION

            Paragraph description = new Paragraph(
                    "Rapport généré automatiquement à partir "
                    + "des données du système de gestion d'inventaire.",
                    texteFont
            );

            description.setAlignment(Element.ALIGN_CENTER);
            description.setSpacingAfter(80);

            document.add(description);


            // SYSTÈME

            Paragraph system = new Paragraph(
                    "Système de gestion du patrimoine",
                    sousTitreFont
            );

            system.setAlignment(Element.ALIGN_CENTER);

            document.add(system);


            // INFORMATIONS

            Paragraph info = new Paragraph(
                    "Centre CSZIAM",
                    petitFont
            );

            info.setAlignment(Element.ALIGN_CENTER);
            info.setSpacingBefore(20);

            document.add(info);


            // Nouvelle page
            document.newPage();

            // CONTENU DU RAPPORT
            String[] lignes = rapport.split("\\r?\\n");

            for (String ligne : lignes) {

                ligne = ligne.trim();

                if (ligne.isEmpty()) {

                    document.add(
                            new Paragraph(" ")
                    );

                    continue;
                }
                // TITRES DE SECTIONS
                if (estUnTitre(ligne)) {

                    Paragraph section =
                            new Paragraph(
                                    ligne,
                                    sectionFont
                            );

                    section.setSpacingBefore(18);
                    section.setSpacingAfter(10);

                    section.setKeepTogether(true);

                    document.add(section);

                    // Ligne décorative
                    LineSeparator line =
                            new LineSeparator();

                    line.setLineColor(BLEU_CLAIR);
                    line.setLineWidth(1.5f);

                    document.add(line);

                    document.add(
                            new Paragraph(" ")
                    );

                    continue;
                }

                // LIGNES DE SÉPARATION
                if (ligne.matches("^-+$")) {
                    continue;
                }

                // LISTES NUMÉROTÉES
                if (ligne.matches("^\\d+[.)]\\s+.*")) {

                    Paragraph liste =
                            new Paragraph(
                                    ligne,
                                    texteFont
                            );

                    liste.setIndentationLeft(15);
                    liste.setFirstLineIndent(-5);
                    liste.setSpacingAfter(6);

                    document.add(liste);

                    continue;
                }

                // LISTES AVEC *

                if (ligne.startsWith("*")) {

                    String contenu =
                            ligne.substring(1).trim();

                    Paragraph liste =
                            new Paragraph(
                                    "• " + contenu,
                                    texteFont
                            );

                    liste.setIndentationLeft(15);
                    liste.setSpacingAfter(6);

                    document.add(liste);

                    continue;
                }

                // TEXTE NORMAL
                Paragraph paragraphe =
                        new Paragraph(
                                ligne,
                                texteFont
                        );

                paragraphe.setAlignment(
                        Element.ALIGN_JUSTIFIED
                );

                paragraphe.setLeading(
                        0,
                        1.25f
                );

                paragraphe.setSpacingAfter(8);

                document.add(paragraphe);
            }


            // FIN DU RAPPORT
            document.add(new Paragraph(" "));

            Paragraph fin = new Paragraph("Fin du rapport", grasFont);
            fin.setAlignment(Element.ALIGN_CENTER);
            fin.setSpacingBefore(20);
            document.add(fin);
            document.close();
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération du PDF : " + e.getMessage(), e);
        }

        return outputStream.toByteArray();
    }

    // DÉTECTER LES TITRES
    private boolean estUnTitre(String ligne) {

        return ligne.equalsIgnoreCase("Introduction")
               || ligne.equalsIgnoreCase("Synthèse Générale")
               || ligne.equalsIgnoreCase("État du Patrimoine")
               || ligne.equalsIgnoreCase("Répartition du Patrimoine")
               || ligne.equalsIgnoreCase("Analyse des Mouvements")
               || ligne.equalsIgnoreCase("État de l'Inventaire")
               || ligne.equalsIgnoreCase("Campagne d’Inventaire")
               || ligne.equalsIgnoreCase("Campagne d'Inventaire")
               || ligne.equalsIgnoreCase("Analyse des Utilisateurs")
               || ligne.equalsIgnoreCase("Principaux Constats")
               || ligne.equalsIgnoreCase("Recommandations")
               || ligne.equalsIgnoreCase("Conclusion");
    }

    // EXTRAIRE L'ANNÉE
    private String extraireAnnee(String rapport) {

        java.util.regex.Pattern pattern =
                java.util.regex.Pattern.compile(
                        "\\b(20\\d{2})\\b"
                );

        java.util.regex.Matcher matcher =
                pattern.matcher(rapport);

        if (matcher.find()) {

            return matcher.group(1);
        }

        // Valeur de secours
        return String.valueOf(
                java.time.Year.now().getValue()
        );
    }

    // HEADER + FOOTER
    private static class HeaderFooterPageEvent
            extends PdfPageEventHelper {

        private final Font headerFont =
                new Font(
                        Font.HELVETICA,
                        8.5f,
                        Font.NORMAL,
                        GRIS_FONCE
                );

        private final Font footerFont =
                new Font(
                        Font.HELVETICA,
                        8,
                        Font.NORMAL,
                        GRIS_FONCE
                );


        @Override
        public void onEndPage(
                PdfWriter writer,
                Document document
        ) {

            PdfContentByte canvas =
                    writer.getDirectContent();

            // HEADER
            ColumnText.showTextAligned(
                    canvas,
                    Element.ALIGN_LEFT,
                    new Phrase(
                            "CENTRE CSZIAM",
                            headerFont
                    ),
                    document.left(),
                    document.top() + 25,
                    0
            );


            ColumnText.showTextAligned(
                    canvas,
                    Element.ALIGN_RIGHT,
                    new Phrase(
                            "Rapport d'inventaire",
                            headerFont
                    ),
                    document.right(),
                    document.top() + 25,
                    0
            );


            // Ligne du header

            canvas.setColorStroke(
                    BLEU_CLAIR
            );

            canvas.setLineWidth(1);

            canvas.moveTo(
                    document.left(),
                    document.top() + 15
            );

            canvas.lineTo(
                    document.right(),
                    document.top() + 15
            );

            canvas.stroke();

            // FOOTER
            canvas.setColorStroke(
                    GRIS_CLAIR
            );

            canvas.setLineWidth(0.7f);

            canvas.moveTo(
                    document.left(),
                    document.bottom() - 20
            );

            canvas.lineTo(
                    document.right(),
                    document.bottom() - 20
            );

            canvas.stroke();


            ColumnText.showTextAligned(
                    canvas,
                    Element.ALIGN_LEFT,
                    new Phrase(
                            "Système de gestion du patrimoine",
                            footerFont
                    ),
                    document.left(),
                    document.bottom() - 35,
                    0
            );


            ColumnText.showTextAligned(
                    canvas,
                    Element.ALIGN_RIGHT,
                    new Phrase(
                            "Page " + writer.getPageNumber(),
                            footerFont
                    ),
                    document.right(),
                    document.bottom() - 35,
                    0
            );
        }
    }
}